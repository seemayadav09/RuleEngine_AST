const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require('cors');
const db = new sqlite3.Database('rules.db');  // Persistent SQLite database
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rule Engine Node Class
class Node {
    constructor(type, value, left = null, right = null) {
        this.type = type;
        this.value = value;
        this.left = left;
        this.right = right;
    }

    toDict() {
        return {
            type: this.type,
            value: this.value,
            left: this.left ? this.left.toDict() : null,
            right: this.right ? this.right.toDict() : null
        };
    }

    static fromDict(data) {
        if (!data) return null;
        return new Node(
            data.type,
            data.value,
            Node.fromDict(data.left),
            Node.fromDict(data.right)
        );
    }
}

// Initialize Database Schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rule_string TEXT NOT NULL,
        ast TEXT NOT NULL
    )`);
});
// Helper function: Parse rule string into AST
function parseRuleString(ruleString) {
    try {
        const tokens = ruleString.match(/\w+|'[^']+'|[><=]|AND|OR|\(|\)/g);
        const stack = [[]];

        tokens.forEach(token => {
            if (token === '(') {
                stack.push([]);
            } else if (token === ')') {
                const expr = stack.pop();
                stack[stack.length - 1].push(expr);
            } else {
                stack[stack.length - 1].push(token);
            }
        });

        function buildTree(expr) {
            if (Array.isArray(expr)) {
                if (expr.length === 1) return buildTree(expr[0]);

                // Handle AND/OR operators
                const operatorIndex = expr.findIndex(op => op === 'AND' || op === 'OR');
                if (operatorIndex !== -1) {
                    const operator = expr[operatorIndex];
                    return new Node(
                        'operator', 
                        operator, 
                        buildTree(expr.slice(0, operatorIndex)), 
                        buildTree(expr.slice(operatorIndex + 1))
                    );
                }
            }

            // Handle operands (like "age > 30", "department = 'Sales'")
            return new Node('operand', expr.join(' '));
        }

        return buildTree(stack[0]);
    } catch (error) {
        throw new Error('Invalid rule string format.');
    }
}

// helper function: Evaluate AST
function evaluateAst(ast, data) {
    if (ast.type === 'operator') {
        const left = evaluateAst(ast.left, data);
        const right = evaluateAst(ast.right, data);
        return ast.value === 'AND' ? left && right : left || right;
    } else if (ast.type === 'operand') {
        const [left, op, right] = ast.value.split(' ');
        if (!data.hasOwnProperty(left)) {
            throw new Error(`Missing attribute '${left}' in input data.`);
        }
        const leftValue = data[left];
        const rightValue = isNaN(right) ? right.replace(/'/g, '') : parseFloat(right);
        switch (op) {
            case '>': return leftValue > rightValue;
            case '<': return leftValue < rightValue;
            case '=': return leftValue === rightValue;
            default: throw new Error(`Unsupported operator '${op}'.`);
        }
    }
    return false;
}

// API Endpoints

// Create Rule
app.post('/create_rule', (req, res) => {
    const { rule_string } = req.body;
    try {
        const ast = parseRuleString(rule_string);
        const astJson = JSON.stringify(ast.toDict());
        db.run(`INSERT INTO rules (rule_string, ast) VALUES (?, ?)`, [rule_string, astJson], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, ast });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Combine Rules
app.post('/combine_rules', (req, res) => {
    const { rule_strings } = req.body;
    console.log('rulestrings', rule_strings)
    try {
        const asts = rule_strings.map(ruleString => {
            const ast = parseRuleString(ruleString);
            return ast;
        });
        const combinedAst = asts.reduce((acc, ast) => new Node('operator', 'AND', acc, ast));
        const astJson = JSON.stringify(combinedAst.toDict());

        db.run(`INSERT INTO rules (rule_string, ast) VALUES (?, ?)`, ['(Combined rule)', astJson], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, ast: combinedAst });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.post('/evaluate_rule', (req, res) => {
    const { rule_id, data } = req.body;
    db.get(`SELECT ast FROM rules WHERE id = ?`, [rule_id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(400).json({ error: 'Rule ID not found.' });
        } else {
            const ast = Node.fromDict(JSON.parse(row.ast));
            try {
                const result = evaluateAst(ast, data);
                res.json({ result });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    });
});

app.post('/modify_rule', (req, res) => {
    const { rule_id, new_rule_string } = req.body;
    try {
        const newAst = parseRuleString(new_rule_string);
        const astJson = JSON.stringify(newAst.toDict());
        db.run(`UPDATE rules SET rule_string = ?, ast = ? WHERE id = ?`, [new_rule_string, astJson, rule_id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: rule_id, ast: newAst });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});


