---
name: local-dev-setup
description: "Setup local development environment from scratch for this project"
auto-activates:
  - "dev setup"
  - "local environment"
  - "install dependencies"
  - "setup development"
  - "getting started"
---

# Skill: Local Development Setup

## When to Use This Skill

This skill activates when you need to:
- Set up the project for local development from scratch
- Install all dependencies
- Configure environment variables
- Verify the setup works

## Prerequisites

- Git installed
- Basic development tools for the tech stack (Python/Node/Go/etc.)
- Text editor or IDE

## Step-by-Step Workflow

### Step 1: Clone Repository (if needed)

```bash
git clone <repository-url>
cd <project-directory>
```

### Step 2: Detect Tech Stack

**Look for indicators:**
- `package.json` → Node.js/JavaScript
- `requirements.txt` or `pyproject.toml` → Python
- `go.mod` → Go
- `Cargo.toml` → Rust
- `Gemfile` → Ruby
- `pom.xml` or `build.gradle` → Java

### Step 3: Install Dependencies by Tech Stack

#### Python

**Check Python version:**
```bash
python --version
# or
python3 --version
```

**Option A: pip + virtualenv**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# If dev dependencies exist:
pip install -r requirements-dev.txt
```

**Option B: Poetry**
```bash
# Install Poetry if needed
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Activate shell
poetry shell
```

**Option C: Pipenv**
```bash
# Install Pipenv if needed
pip install pipenv

# Install dependencies
pipenv install --dev

# Activate shell
pipenv shell
```

**Option D: conda**
```bash
# Create environment
conda create -n projectname python=3.10

# Activate environment
conda activate projectname

# Install dependencies
conda install --file requirements.txt
# or
pip install -r requirements.txt
```

#### JavaScript/TypeScript (Node.js)

**Check Node version:**
```bash
node --version
npm --version
```

**Install Node.js if needed:**
- Use [nvm](https://github.com/nvm-sh/nvm): `nvm install node`
- Download from [nodejs.org](https://nodejs.org/)

**Install dependencies:**

**Option A: npm**
```bash
npm install
```

**Option B: yarn**
```bash
# Install Yarn if needed
npm install -g yarn

yarn install
```

**Option C: pnpm**
```bash
# Install pnpm if needed
npm install -g pnpm

pnpm install
```

#### Go

**Check Go version:**
```bash
go version
```

**Install dependencies:**
```bash
# Download dependencies
go mod download

# Verify dependencies
go mod verify

# Tidy up (remove unused, add missing)
go mod tidy
```

#### Rust

**Check Rust version:**
```bash
rustc --version
cargo --version
```

**Install Rust if needed:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Install dependencies:**
```bash
cargo build
```

#### Ruby

**Check Ruby version:**
```bash
ruby --version
```

**Install dependencies:**
```bash
# Install bundler if needed
gem install bundler

# Install gems
bundle install
```

#### Java (Maven)

**Check Java version:**
```bash
java -version
mvn --version
```

**Install dependencies:**
```bash
mvn clean install
```

#### Java (Gradle)

**Install dependencies:**
```bash
./gradlew build
```

### Step 4: Configure Environment Variables

**Check for environment variable requirements:**
- Look for `.env.example`, `.env.template`, or `.env.sample`
- Check README for required variables
- Look for config files mentioning environment variables

**Create .env file:**
```bash
# Copy example if it exists
cp .env.example .env

# Edit with your values
nano .env  # or use your editor
```

**Common environment variables to set:**
```bash
# Database
DATABASE_URL=postgresql://localhost:5432/dbname
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=user
DB_PASSWORD=password

# API Keys (get from service providers)
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here

# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=debug

# Ports
PORT=3000
API_PORT=8000
```

### Step 5: Initialize Database (if applicable)

**Check for database setup scripts:**
```bash
# Look for:
- db/schema.sql
- migrations/
- init.sql
- seeds/
```

**Common database setup:**

**Python (Django):**
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata initial_data
```

**Python (Flask/SQLAlchemy):**
```bash
flask db upgrade
flask seed  # if seed command exists
```

**Node.js (Prisma):**
```bash
npx prisma migrate dev
npx prisma db seed
```

**Node.js (Sequelize):**
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

**Ruby on Rails:**
```bash
rails db:create
rails db:migrate
rails db:seed
```

### Step 6: Build Project (if applicable)

**JavaScript/TypeScript:**
```bash
npm run build
```

**Go:**
```bash
go build
```

**Rust:**
```bash
cargo build --release
```

**Java (Maven):**
```bash
mvn package
```

### Step 7: Run Development Server

**Check {{dev_command}} or look for:**
- README instructions
- `package.json` scripts
- Makefile targets
- Documentation

**Common dev commands:**

**Python (Django):**
```bash
python manage.py runserver
```

**Python (Flask):**
```bash
flask run
# or
python app.py
```

**Python (FastAPI):**
```bash
uvicorn main:app --reload
```

**Node.js:**
```bash
npm run dev
# or
npm start
```

**Go:**
```bash
go run main.go
# or
air  # if using air for hot reload
```

**Rust:**
```bash
cargo run
# or
cargo watch -x run  # if using cargo-watch
```

**Ruby on Rails:**
```bash
rails server
```

### Step 8: Verify Setup

**Run tests:**
```bash
{{test_command}}
# or common commands:
pytest
npm test
go test ./...
cargo test
```

**Access the application:**
- Check README for default port
- Common ports: 3000, 8000, 8080, 5000
- Visit: `http://localhost:PORT`

**Check logs:**
- Ensure no error messages
- Verify database connections work
- Check API endpoints respond

## Common Issues and Solutions

### Issue: Dependencies fail to install

**Solutions:**
1. Clear package cache
   - npm: `npm cache clean --force`
   - pip: `pip cache purge`
   - go: `go clean -modcache`
2. Update package manager: `npm install -g npm@latest`
3. Check for system dependencies (build tools, libraries)
4. Try with `--legacy-peer-deps` (npm) or `--force`

### Issue: Database connection fails

**Solutions:**
1. Verify database is running: `docker ps` or `systemctl status postgresql`
2. Check connection string format
3. Verify credentials
4. Check firewall/port access
5. Try connecting with database client first

### Issue: Environment variables not loading

**Solutions:**
1. Check .env file exists and is in root directory
2. Verify .env not in .gitignore (it should be!)
3. Check framework-specific env loading (dotenv, etc.)
4. Try explicit export: `export $(cat .env | xargs)`

### Issue: Port already in use

**Solutions:**
1. Find process using port: `lsof -i :3000`
2. Kill process: `kill -9 <PID>`
3. Change port in configuration
4. Check for other dev servers running

### Issue: Module/import not found

**Solutions:**
1. Reinstall dependencies
2. Check package is in package.json/requirements.txt
3. Activate virtual environment
4. Clear and reinstall node_modules or venv
5. Check import path spelling

## Success Criteria

- ✅ All dependencies installed without errors
- ✅ Environment variables configured
- ✅ Database initialized (if applicable)
- ✅ Development server starts successfully
- ✅ Tests run and pass
- ✅ Application accessible in browser/API works

## Quick Checklist

```bash
# 1. Clone and navigate
git clone <url> && cd <project>

# 2. Install dependencies
[npm install | pip install -r requirements.txt | go mod download]

# 3. Setup environment
cp .env.example .env && nano .env

# 4. Initialize database
[migration commands]

# 5. Run dev server
[npm run dev | flask run | go run main.go]

# 6. Run tests
[npm test | pytest | go test ./...]
```

## Related Skills

- **pytest-setup** - Configure testing
- **code-formatting** - Setup formatters/linters
- **git-workflow** - Git branch and commit workflow
- **ci-pipeline** - CI/CD setup

## Documentation References

- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [npm Documentation](https://docs.npmjs.com/)
- [Go Modules](https://go.dev/doc/modules)
- [Cargo Book](https://doc.rust-lang.org/cargo/)
