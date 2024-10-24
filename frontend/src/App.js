import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, TextareaAutosize } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from "axios";

const theme = createTheme(); // Create a default theme

const App = () => {
  const [createRuleInput, setCreateRuleInput] = useState("");
  const [createRuleResponse, setCreateRuleResponse] = useState(null);

  const [combineRuleInput, setCombineRuleInput] = useState("");
  const [combineRuleResponse, setCombineRuleResponse] = useState(null);

  const [evaluateRuleIdInput, setEvaluateRuleIdInput] = useState("");
  const [evaluateRuleDataInput, setEvaluateRuleDataInput] = useState("");
  const [evaluateRuleResponse, setEvaluateRuleResponse] = useState(null);

  const [modifyRuleIdInput, setModifyRuleIdInput] = useState("");
  const [modifyRuleStringInput, setModifyRuleStringInput] = useState("");
  const [modifyRuleResponse, setModifyRuleResponse] = useState(null);

  const BASE_URL = "http://127.0.0.1:5000";

  const handleCreateRule = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/create_rule`, { rule_string: createRuleInput });
      setCreateRuleResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCombineRules = async () => {
    const ruleStrings = combineRuleInput.split(",").map((rule) => rule.trim());
    try {
        const response = await axios.post(`${BASE_URL}/combine_rules`, { rule_strings: ruleStrings });
        console.log('response', response)
        setCombineRuleResponse(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  const handleEvaluateRule = async () => {
    const data = JSON.parse(evaluateRuleDataInput);
    try {
      const response = await axios.post(`${BASE_URL}/evaluate_rule`, { rule_id: parseInt(evaluateRuleIdInput), data });
      setEvaluateRuleResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModifyRule = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/modify_rule`, {
        rule_id: parseInt(modifyRuleIdInput),
        new_rule_string: modifyRuleStringInput,
      });
      setModifyRuleResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Rule Engine GUI
        </Typography>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5">Create Rule</Typography>
          <TextField
            fullWidth
            label="Enter rule string"
            variant="outlined"
            value={createRuleInput}
            onChange={(e) => setCreateRuleInput(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleCreateRule}>
            Create Rule
          </Button>
          {createRuleResponse && <pre>{JSON.stringify(createRuleResponse, null, 2)}</pre>}
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5">Combine Rules</Typography>
          <TextField
              fullWidth
              label="Enter comma-separated rule strings"
              variant="outlined"
              value={combineRuleInput}
              onChange={(e) => setCombineRuleInput(e.target.value)}
              sx={{ my: 2 }}
          />

          <Button variant="contained" color="primary" onClick={handleCombineRules}>
            Combine Rules
          </Button>
          {combineRuleResponse && <pre>{JSON.stringify(combineRuleResponse, null, 2)}</pre>}
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5">Evaluate Rule</Typography>
          <TextField
            fullWidth
            label="Enter rule ID"
            variant="outlined"
            value={evaluateRuleIdInput}
            onChange={(e) => setEvaluateRuleIdInput(e.target.value)}
            sx={{ my: 2 }}
          />
          <TextareaAutosize
            minRows={5}
            placeholder="Enter data in JSON format"
            style={{ width: "100%", padding: "10px" }}
            value={evaluateRuleDataInput}
            onChange={(e) => setEvaluateRuleDataInput(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleEvaluateRule} sx={{ my: 2 }}>
            Evaluate Rule
          </Button>
          {evaluateRuleResponse && <pre>{JSON.stringify(evaluateRuleResponse, null, 2)}</pre>}
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5">Modify Rule</Typography>
          <TextField
            fullWidth
            label="Enter rule ID"
            variant="outlined"
            value={modifyRuleIdInput}
            onChange={(e) => setModifyRuleIdInput(e.target.value)}
            sx={{ my: 2 }}
          />
          <TextField
            fullWidth
            label="Enter new rule string"
            variant="outlined"
            value={modifyRuleStringInput}
            onChange={(e) => setModifyRuleStringInput(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleModifyRule}>
            Modify Rule
          </Button>
          {modifyRuleResponse && <pre>{JSON.stringify(modifyRuleResponse, null, 2)}</pre>}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;