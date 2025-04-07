// Improved Card UI for Question List
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  TextField,
  Stack,
} from "@mui/material";
import {
  Delete,
  ExpandLess,
  ExpandMore,
  AddCircle,
  Edit,
} from "@mui/icons-material";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const SuitableTypes = ["OILY", "DRY", "COMBINATION", "SENSITIVE", "NORMAL"];

export default function QuestionOptionManager() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [multiOptions, setMultiOptions] = useState([
    { label: "", suitableType: "" },
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    type: null,
    id: null,
  });
  const [openStates, setOpenStates] = useState({});
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [editQuestionDialog, setEditQuestionDialog] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [editOptionDialog, setEditOptionDialog] = useState({
    open: false,
    id: null,
    label: "",
    suitableType: "",
  });

  const [addOptionDialog, setAddOptionDialog] = useState({
    open: false,
    questionId: null,
    label: "",
    suitableType: "",
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await axios.get(`${API_BASE}/questions`);
    setQuestions(res.data);
    const newOpenStates = {};
    res.data.forEach((q) => (newOpenStates[q.id] = false));
    setOpenStates(newOpenStates);
  };

  const createQuestionWithOptions = async () => {
    if (!newQuestion.trim()) return;
    if (!multiOptions.every((opt) => opt.label && opt.suitableType)) {
      setSnackbar({
        open: true,
        message: "Please complete all options.",
        severity: "warning",
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/questions`, {
        name: newQuestion,
      });
      const questionId = res.data.id;

      for (const opt of multiOptions) {
        await axios.post(`${API_BASE}/options?questionId=${questionId}`, opt);
      }

      setNewQuestion("");
      setMultiOptions([{ label: "", suitableType: "" }]);
      setOpenCreateDialog(false);
      fetchQuestions();
      setSnackbar({
        open: true,
        message: "Question and options added",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error adding question/options",
        severity: "error",
      });
    }
  };

  const addOptionToExistingQuestion = async () => {
    const { questionId, label, suitableType } = addOptionDialog;
    if (!label || !suitableType) {
      setSnackbar({
        open: true,
        message: "Please complete the option.",
        severity: "warning",
      });
      return;
    }

    try {
      await axios.post(`${API_BASE}/options?questionId=${questionId}`, {
        label,
        suitableType,
      });
      setAddOptionDialog({
        open: false,
        questionId: null,
        label: "",
        suitableType: "",
      });
      fetchQuestions();
      setSnackbar({
        open: true,
        message: "Option added",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error adding option",
        severity: "error",
      });
    }
  };

  const updateMultiOption = (index, field, value) => {
    const updated = [...multiOptions];
    updated[index][field] = value;
    setMultiOptions(updated);
  };

  const updateQuestion = async () => {
    const { id, name } = editQuestionDialog;
    await axios.put(`${API_BASE}/questions/${id}`, { name });
    setEditQuestionDialog({ open: false, id: null, name: "" });
    fetchQuestions();
    setSnackbar({
      open: true,
      message: "Question updated",
      severity: "success",
    });
  };

  const updateOption = async () => {
    const { id, label, suitableType } = editOptionDialog;
    await axios.put(`${API_BASE}/options/${id}`, { label, suitableType });
    setEditOptionDialog({ open: false, id: null, label: "", suitableType: "" });
    fetchQuestions();
    setSnackbar({ open: true, message: "Option updated", severity: "success" });
  };

  const toggleOpen = (id) => {
    setOpenStates({ ...openStates, [id]: !openStates[id] });
  };

  const deleteItem = async () => {
    const { type, id } = confirmDelete;
    await axios.delete(
      `${API_BASE}/${type === "question" ? "questions" : "options"}/${id}`
    );
    setConfirmDelete({ open: false, type: null, id: null });
    fetchQuestions();
    setSnackbar({ open: true, message: `${type} deleted`, severity: "info" });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Question & Option Manager
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Add Question & Options
        </Button>
      </Stack>

      <Stack spacing={2}>
        {questions.map((q, index) => (
          <Card key={q.id} variant="outlined">
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight={600}>
                  {index + 1}. {q.name}
                </Typography>
                <Box>
                  <IconButton onClick={() => toggleOpen(q.id)}>
                    {openStates[q.id] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setEditQuestionDialog({
                        open: true,
                        id: q.id,
                        name: q.name,
                      })
                    }
                  >
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setConfirmDelete({
                        open: true,
                        type: "question",
                        id: q.id,
                      })
                    }
                  >
                    <Delete color="error" />
                  </IconButton>
                </Box>
              </Box>
              <Collapse in={openStates[q.id]} timeout="auto" unmountOnExit>
                <List sx={{ mt: 1 }}>
                  {q.options?.map((opt, index) => (
                    <ListItem
                      key={opt.id}
                      secondaryAction={
                        <>
                          <IconButton
                            onClick={() =>
                              setEditOptionDialog({
                                open: true,
                                id: opt.id,
                                label: opt.label,
                                suitableType: opt.suitableType,
                              })
                            }
                          >
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setConfirmDelete({
                                open: true,
                                type: "option",
                                id: opt.id,
                              })
                            }
                          >
                            <Delete color="error" />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText
                        primary={`${index + 1}. ${opt.label}`}
                        secondary={`Type: ${opt.suitableType}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  size="small"
                  startIcon={<AddCircle />}
                  onClick={() =>
                    setAddOptionDialog({
                      open: true,
                      questionId: q.id,
                      label: "",
                      suitableType: "",
                    })
                  }
                  sx={{ mt: 1, ml: 2 }}
                >
                  Add Option
                </Button>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Create Question Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Question & Options</DialogTitle>
        <DialogContent>
          <TextField
            label="Question Name"
            fullWidth
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            sx={{ mt: 1 }}
          />
          {multiOptions.map((opt, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                label={`Option ${idx + 1}`}
                value={opt.label}
                onChange={(e) =>
                  updateMultiOption(idx, "label", e.target.value)
                }
                fullWidth
              />
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={opt.suitableType}
                  onChange={(e) =>
                    updateMultiOption(idx, "suitableType", e.target.value)
                  }
                  label="Type"
                >
                  {SuitableTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ))}
          <Button
            onClick={() =>
              setMultiOptions([...multiOptions, { label: "", suitableType: "" }])
            }
            sx={{ mt: 2 }}
          >
            + Add More Options
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={createQuestionWithOptions}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Option to Existing Question */}
      <Dialog
        open={addOptionDialog.open}
        onClose={() =>
          setAddOptionDialog({
            open: false,
            questionId: null,
            label: "",
            suitableType: "",
          })
        }
      >
        <DialogTitle>Add Option</DialogTitle>
        <DialogContent>
          <TextField
            label="Option Label"
            fullWidth
            value={addOptionDialog.label}
            onChange={(e) =>
              setAddOptionDialog({ ...addOptionDialog, label: e.target.value })
            }
            sx={{ mt: 1 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={addOptionDialog.suitableType}
              onChange={(e) =>
                setAddOptionDialog({
                  ...addOptionDialog,
                  suitableType: e.target.value,
                })
              }
              label="Type"
            >
              {SuitableTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setAddOptionDialog({
                open: false,
                questionId: null,
                label: "",
                suitableType: "",
              })
            }
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={addOptionToExistingQuestion}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog
        open={editQuestionDialog.open}
        onClose={() =>
          setEditQuestionDialog({ open: false, id: null, name: "" })
        }
      >
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Question Name"
            fullWidth
            value={editQuestionDialog.name}
            onChange={(e) =>
              setEditQuestionDialog({
                ...editQuestionDialog,
                name: e.target.value,
              })
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setEditQuestionDialog({ open: false, id: null, name: "" })
            }
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={updateQuestion}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Option Dialog */}
      <Dialog
        open={editOptionDialog.open}
        onClose={() =>
          setEditOptionDialog({
            open: false,
            id: null,
            label: "",
            suitableType: "",
          })
        }
      >
        <DialogTitle>Edit Option</DialogTitle>
        <DialogContent>
          <TextField
            label="Option Label"
            fullWidth
            value={editOptionDialog.label}
            onChange={(e) =>
              setEditOptionDialog({
                ...editOptionDialog,
                label: e.target.value,
              })
            }
            sx={{ mt: 1 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={editOptionDialog.suitableType}
              onChange={(e) =>
                setEditOptionDialog({
                  ...editOptionDialog,
                  suitableType: e.target.value,
                })
              }
              label="Type"
            >
              {SuitableTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setEditOptionDialog({
                open: false,
                id: null,
                label: "",
                suitableType: "",
              })
            }
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={updateOption}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, type: null, id: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {confirmDelete.type}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDelete({ open: false, type: null, id: null })
            }
          >
            Cancel
          </Button>
          <Button color="error" onClick={deleteItem}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
