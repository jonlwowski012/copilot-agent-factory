---
name: creating-database-migrations
description: Guide for creating and managing database schema migrations including version control, rollback strategies, and data migrations. Use when changing database schema, adding tables, or modifying columns.
---

# Creating Database Migrations

## When to Use This Skill

- Adding new tables or columns to database
- Modifying existing schema structure
- Creating indexes for performance
- Data transformations during schema changes
- Rolling back schema changes

## Migration Tools Detection

**Auto-detect migration tool:**

### Python
- **Alembic** (SQLAlchemy): `alembic.ini` present
- **Django**: `manage.py` with `migrations/` directories
- **Flask-Migrate**: Uses Alembic under Flask

### JavaScript/TypeScript
- **Prisma**: `prisma/schema.prisma`
- **TypeORM**: `ormconfig.json` or data-source config
- **Knex**: `knexfile.js`
- **Sequelize**: `.sequelizerc` or models directory

### Other
- **Ruby on Rails**: `db/migrate/`
- **Laravel**: `database/migrations/`
- **Flyway** (Java): `db/migration/`
- **Liquibase** (Java): XML/YAML changelogs

## Step 1: Create Migration File

### Alembic (Python/SQLAlchemy)

```bash
# Auto-generate from model changes
alembic revision --autogenerate -m "Add user email column"

# Create empty migration
alembic revision -m "Add custom index"
```

**Generated file:**
```python
# migrations/versions/abc123_add_user_email_column.py
from alembic import op
import sqlalchemy as sa

revision = 'abc123'
down_revision = 'xyz789'

def upgrade():
    op.add_column('users',
        sa.Column('email', sa.String(255), nullable=False)
    )

def downgrade():
    op.drop_column('users', 'email')
```

### Django

```bash
# Auto-generate from model changes
python manage.py makemigrations

# Create empty migration
python manage.py makemigrations --empty myapp
```

**Generated file:**
```python
# myapp/migrations/0002_add_email_field.py
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=255),
        ),
    ]
```

### Prisma (TypeScript/JavaScript)

```bash
# 1. Update schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_user_email
```

**Schema file:**
```prisma
// prisma/schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique  // New field
}
```

## Step 2: Common Migration Operations

### Adding a Column

**With default value (safe for existing data):**

```python
# Alembic
def upgrade():
    op.add_column('users',
        sa.Column('email', sa.String(255), nullable=False, server_default='')
    )
    # Remove server_default after backfill if needed
    op.alter_column('users', 'email', server_default=None)
```

**Nullable first, then make required:**

```python
# Step 1: Add as nullable
def upgrade():
    op.add_column('users',
        sa.Column('email', sa.String(255), nullable=True)
    )

# Step 2 (separate migration): Backfill data
def upgrade():
    op.execute("UPDATE users SET email = username || '@example.com' WHERE email IS NULL")

# Step 3 (separate migration): Make NOT NULL
def upgrade():
    op.alter_column('users', 'email', nullable=False)
```

### Modifying a Column

```python
# Alembic - Change column type
def upgrade():
    op.alter_column('users', 'age',
        type_=sa.Integer(),
        existing_type=sa.String()
    )

# Alembic - Rename column
def upgrade():
    op.alter_column('users', 'username', new_column_name='email')
```

### Adding an Index

```python
# Alembic
def upgrade():
    op.create_index('idx_users_email', 'users', ['email'])

def downgrade():
    op.drop_index('idx_users_email', 'users')
```

```sql
-- Raw SQL (if needed)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

### Creating a Table

```python
# Alembic
def upgrade():
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('content', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index('idx_posts_user_id', 'posts', ['user_id'])

def downgrade():
    op.drop_index('idx_posts_user_id', 'posts')
    op.drop_table('posts')
```

### Adding Foreign Key

```python
# Alembic
def upgrade():
    op.create_foreign_key(
        'fk_posts_user_id',
        'posts', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

def downgrade():
    op.drop_constraint('fk_posts_user_id', 'posts', type_='foreignkey')
```

## Step 3: Data Migrations

**When schema change requires data transformation:**

```python
# Alembic data migration example
from alembic import op
from sqlalchemy.orm import Session
from myapp.models import User

def upgrade():
    # Add new column
    op.add_column('users', sa.Column('full_name', sa.String(200)))
    
    # Migrate data
    bind = op.get_bind()
    session = Session(bind=bind)
    
    users = session.execute("SELECT id, first_name, last_name FROM users").fetchall()
    for user_id, first_name, last_name in users:
        full_name = f"{first_name} {last_name}"
        session.execute(
            "UPDATE users SET full_name = :full_name WHERE id = :id",
            {"full_name": full_name, "id": user_id}
        )
    
    session.commit()
    
    # Drop old columns
    op.drop_column('users', 'first_name')
    op.drop_column('users', 'last_name')

def downgrade():
    # Reverse migration
    op.add_column('users', sa.Column('first_name', sa.String(100)))
    op.add_column('users', sa.Column('last_name', sa.String(100)))
    
    bind = op.get_bind()
    session = Session(bind=bind)
    
    users = session.execute("SELECT id, full_name FROM users").fetchall()
    for user_id, full_name in users:
        parts = full_name.split(' ', 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''
        session.execute(
            "UPDATE users SET first_name = :first, last_name = :last WHERE id = :id",
            {"first": first_name, "last": last_name, "id": user_id}
        )
    
    session.commit()
    op.drop_column('users', 'full_name')
```

## Step 4: Test Migration

### Test Locally

```bash
# Alembic
alembic upgrade head    # Apply migration
alembic downgrade -1    # Rollback one step
alembic upgrade head    # Re-apply

# Django
python manage.py migrate
python manage.py migrate myapp 0001  # Rollback to specific version
python manage.py migrate myapp       # Re-apply

# Prisma
npx prisma migrate dev
npx prisma migrate reset  # Reset database (dev only)
```

### Verify Data Integrity

```sql
-- Check column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'email';

-- Check data
SELECT id, email FROM users LIMIT 10;

-- Check constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users';
```

## Step 5: Apply to Production

### Pre-Production Checklist

- ✅ Migration tested locally
- ✅ Rollback strategy defined
- ✅ Backup taken
- ✅ Downtime window scheduled (if needed)
- ✅ Team notified

### Safe Deployment Strategies

#### 1. Backward-Compatible Migrations (Zero Downtime)

**Phase 1: Make column optional**
```python
def upgrade():
    op.add_column('users', sa.Column('email', sa.String(255), nullable=True))
```

**Deploy code that writes to both old and new columns**

**Phase 2: Backfill data**
```python
def upgrade():
    op.execute("UPDATE users SET email = old_email WHERE email IS NULL")
```

**Phase 3: Make required**
```python
def upgrade():
    op.alter_column('users', 'email', nullable=False)
```

**Deploy code that only uses new column**

**Phase 4: Remove old column**
```python
def upgrade():
    op.drop_column('users', 'old_email')
```

#### 2. Large Table Migrations

**Use concurrent operations (PostgreSQL):**
```sql
-- Regular index blocks writes
CREATE INDEX idx_users_email ON users(email);

-- Concurrent index doesn't block
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

**Batch updates for large data migrations:**
```python
def upgrade():
    # Process in batches to avoid locks
    batch_size = 1000
    offset = 0
    
    while True:
        result = op.execute(f"""
            UPDATE users
            SET email = username || '@example.com'
            WHERE email IS NULL
            LIMIT {batch_size}
        """)
        
        if result.rowcount == 0:
            break
        
        offset += batch_size
```

## Rollback Strategy

### Automatic Rollback

```bash
# Alembic - Rollback one migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade abc123

# Django - Rollback
python manage.py migrate myapp 0001

# Prisma - Rollback (creates new migration)
npx prisma migrate resolve --rolled-back abc123
```

### Manual Rollback

**If migration partially applied:**

```sql
-- Check current state
SELECT * FROM alembic_version;

-- Manually revert changes
ALTER TABLE users DROP COLUMN email;

-- Update migration version
UPDATE alembic_version SET version_num = 'previous_version';
```

## Migration Best Practices

### ✅ DO

- **Write reversible migrations** with proper `downgrade()`
- **Test migrations on production-like data**
- **Take backups before running**
- **Use transactions** where possible
- **Make small, incremental changes**
- **Add indexes concurrently** on large tables
- **Version control migration files**

### ❌ DON'T

- **Modify existing migrations** after they've been run
- **Delete migration files** that have been deployed
- **Combine schema and data changes** in one migration (separate them)
- **Use `DROP TABLE` without careful consideration**
- **Forget to test rollback**

## Troubleshooting

### Migration Conflicts

```bash
# Multiple people created migrations
# Resolve by:
1. Merge migration files
2. Update dependencies
3. Test locally
```

### Failed Migration

```bash
# Check logs
alembic current  # See current version
alembic history  # See all migrations

# Fix issue in migration file
# Then retry
alembic upgrade head
```

### Rollback Failed

```sql
-- Manually check database state
SELECT * FROM alembic_version;

-- If needed, manually fix and update version
UPDATE alembic_version SET version_num = 'correct_version';
```

## Project Configuration

**Detected database:** Check for PostgreSQL, MySQL, SQLite
**Migration tool:** {{migration_tool}}
**Database directories:** {{db_dirs}}

Auto-detect from project structure and dependencies.
