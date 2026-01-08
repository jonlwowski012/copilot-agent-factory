# MCP Server Auto-Detection Guide

**Automatically detect and recommend Model Context Protocol (MCP) servers to supercharge your GitHub Copilot agents.**

## What are MCP Servers?

Model Context Protocol servers extend GitHub Copilot's capabilities by providing:

- **Direct database access** - Query databases without writing code
- **Filesystem operations** - Efficient file reading and directory browsing
- **Enhanced language support** - Deep analysis for specific languages (Python via Pylance)
- **Container management** - Inspect and control Docker containers
- **Cloud operations** - Manage AWS, GCP, Azure resources
- **Integration tools** - Connect to GitHub, Slack, Google services, and more

## Auto-Detection Rules

When you run `@agent-generator`, it automatically detects patterns in your repository and recommends relevant MCP servers:

### Essential Servers (Always Recommended)

| Server | Purpose | Detection |
|--------|---------|-----------|
| `@modelcontextprotocol/server-git` | Repository operations, history, diffs | Any git repository |
| `@modelcontextprotocol/server-filesystem` | File operations, directory browsing | Always |

### High Priority (Tech Stack Based)

| Server | Purpose | Detected When |
|--------|---------|---------------|
| `@modelcontextprotocol/server-postgres` | Database queries, schema inspection | PostgreSQL config files, connection strings |
| `@modelcontextprotocol/server-pylance` | Enhanced Python analysis, type checking | Python project (`.py`, `pyproject.toml`, `requirements.txt`) |
| `@modelcontextprotocol/server-docker` | Container management, image operations | `Dockerfile` or `docker-compose.yml` |
| `@modelcontextprotocol/server-github` | Repository management, PR operations | `.github/workflows/` directory |

### Medium Priority (Pattern Based)

| Server | Purpose | Detected When |
|--------|---------|---------------|
| `@modelcontextprotocol/server-kubernetes` | Cluster operations, pod management | `k8s/` or `kubernetes/` directory |
| `@modelcontextprotocol/server-aws` | Cloud resource management | AWS SDK in dependencies |
| `@modelcontextprotocol/server-memory` | Persistent knowledge graph | Complex projects (many files) |

### Specialized Servers (Integration Based)

| Server | Purpose | Detected When |
|--------|---------|---------------|
| `@modelcontextprotocol/server-slack` | Slack workspace operations | Slack SDK in dependencies |
| `@modelcontextprotocol/server-puppeteer` | Browser automation, web scraping | Puppeteer in dependencies |
| `@modelcontextprotocol/server-google-maps` | Google Maps API | Google Maps SDK in dependencies |
| `@modelcontextprotocol/server-google-drive` | Google Drive access | Google Drive SDK in dependencies |
| `@modelcontextprotocol/server-brave-search` | Web search via Brave API | Research-heavy projects |
| `@modelcontextprotocol/server-fetch` | HTTP requests, web content | API client code |
| `@modelcontextprotocol/server-time` | Date/time queries | Date libraries detected |

## Detection Examples

### Example 1: Python + PostgreSQL Web App

**Detected Files:**
```
.git/
pyproject.toml
requirements.txt (includes: fastapi, sqlalchemy, psycopg2)
Dockerfile
docker-compose.yml
.github/workflows/test.yml
```

**Recommended MCP Servers:**
- ✅ `git` (essential)
- ✅ `filesystem` (essential)
- ✅ `postgres` (database detected)
- ✅ `pylance` (Python project)
- ✅ `docker` (Dockerfile present)
- ✅ `github` (GitHub workflows)

### Example 2: Node.js Kubernetes Microservice

**Detected Files:**
```
.git/
package.json (includes: express, @kubernetes/client-node)
k8s/deployment.yaml
.github/workflows/deploy.yml
```

**Recommended MCP Servers:**
- ✅ `git` (essential)
- ✅ `filesystem` (essential)
- ✅ `github` (GitHub workflows)
- ⚠️ `kubernetes` (K8s configs detected)

### Example 3: ML Research Project

**Detected Files:**
```
.git/
pyproject.toml (includes: torch, transformers, datasets)
data/
models/
notebooks/
```

**Recommended MCP Servers:**
- ✅ `git` (essential)
- ✅ `filesystem` (essential)
- ✅ `pylance` (Python project)
- ⚠️ `memory` (complex research project)

## Generated Configuration

The `@agent-generator` creates `.github/mcp-config.json`:

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"],
      "description": "Repository operations, history, and diffs",
      "recommended": true,
      "priority": "essential"
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/repo"],
      "description": "File operations and directory browsing",
      "recommended": true,
      "priority": "essential",
      "setup": "Replace /path/to/repo with your repository path"
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/dbname"],
      "description": "Database queries and schema inspection",
      "recommended": true,
      "priority": "high",
      "requiresConfig": true,
      "setup": "Replace with your database connection string"
    }
  }
}
```

## Setup Instructions

### 1. Review Generated Config

Open `.github/mcp-config.json` and review recommended servers:
- ✅ Servers with `"recommended": true` are strongly suggested
- ⚠️ Servers with `"requiresConfig": true` need configuration

### 2. Configure Connection Strings

For servers requiring configuration:

**PostgreSQL:**
```json
"args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:password@localhost:5432/mydb"]
```

**Filesystem:**
```json
"args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects/myrepo"]
```

**AWS (requires credentials):**
Set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

### 3. Enable in VS Code

Add to your VS Code `settings.json`:

```json
{
  "github.copilot.chat.mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/repo"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    },
    "pylance": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-pylance"]
    }
  }
}
```

### 4. Restart VS Code

Restart VS Code to activate the MCP servers.

### 5. Verify Setup

Open GitHub Copilot Chat and ask:
```
What MCP servers are currently available?
```

## Using MCP Servers with Agents

Once configured, agents automatically leverage MCP servers:

### Database Queries (with Postgres MCP)

```
@database-agent Show me all tables in the database
@database-agent What's the schema for the users table?
@database-agent Find all orders placed in the last 7 days
```

### Repository Operations (with Git MCP)

```
@review-agent Show me changes in the last 3 commits
@debug-agent Check git history for when this bug was introduced
@docs-agent List all files modified in the current branch
```

### Container Management (with Docker MCP)

```
@devops-agent List all running containers
@devops-agent Show logs for the api container
@devops-agent Inspect the database container configuration
```

### Enhanced Python Analysis (with Pylance MCP)

```
@test-agent Analyze type coverage in src/
@refactor-agent Find all unused imports
@review-agent Check for type annotation issues
```

## Customizing Detection

Override MCP server recommendations in `.github/agent-config.yml`:

```yaml
# Customize MCP server recommendations
mcp_servers:
  # Force include specific servers
  include:
    - postgres
    - docker
    - kubernetes
  
  # Exclude servers you don't want
  exclude:
    - aws
    - memory
  
  # Add custom MCP servers
  custom:
    - name: "internal-api"
      command: "node"
      args: ["./mcp-servers/internal-api.js"]
      description: "Company internal API integration"
      priority: "high"
    
    - name: "custom-db"
      command: "python"
      args: ["./mcp-servers/custom_db.py"]
      description: "Custom database connector"
      priority: "medium"
      requiresConfig: true
```

## Troubleshooting

### MCP Server Not Responding

1. Check if `npx` is installed: `npx --version`
2. Manually test the server: `npx -y @modelcontextprotocol/server-git`
3. Check VS Code output panel for errors
4. Restart VS Code

### Database Connection Fails

1. Verify connection string format
2. Test connection manually: `psql postgresql://localhost/mydb`
3. Check firewall/network access
4. Ensure database is running

### Server Installed But Not Working

1. Clear npx cache: `npx clear-npx-cache`
2. Reinstall server: `npx -y @modelcontextprotocol/server-name`
3. Check VS Code logs
4. Update VS Code and Copilot extension

## Best Practices

### Essential Servers

✅ **Always enable:**
- `git` - Core repository operations
- `filesystem` - File browsing and reading

### Project-Specific Servers

✅ **Enable based on your stack:**
- Python projects → `pylance`
- Database apps → `postgres`/appropriate DB server
- Containerized apps → `docker`
- Cloud deployments → `aws`/`kubernetes`

### Avoid Over-Configuration

⚠️ **Don't enable everything:**
- Only enable servers you'll actually use
- Too many servers can slow down responses
- Focus on 3-5 high-value servers for your project

### Security Considerations

🔒 **Keep credentials safe:**
- Never commit credentials to `.github/mcp-config.json`
- Use environment variables for secrets
- Add `.github/mcp-config.json` to `.gitignore` if it contains sensitive data
- Use example config (`.github/mcp-config.example.json`) for documentation

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [VS Code MCP Documentation](https://code.visualstudio.com/docs/copilot/copilot-mcp-servers)
- [Creating Custom MCP Servers](https://modelcontextprotocol.io/docs/creating-servers)
