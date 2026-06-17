import React, { useState, useEffect, useCallback } from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientDetails, assignWorkout, setClientGoal, addClientNote, sendMessageToClient } from '../../services/trainerService';
import { FiArrowLeft, FiPlus, FiTarget, FiMessageSquare, FiFileText, FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showWorkout, setShowWorkout] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [saving, setSaving] = useState(false);

  const [workoutForm, setWorkoutForm] = useState({
    Title: '', Type: 'Strength', Difficulty: 'Intermediate',
    EstimatedDuration: 45, Exercises: [],
  });
  const [goalForm, setGoalForm] = useState({
    Title: '', Type: 'Custom', TargetValue: '', Unit: '', EndDate: '',
  });

  const fetchClient = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getClientDetails(id);
      setClient(data?.data || null);
    } catch {
      toast.error('Failed to load client');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const handleAssignWorkout = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await assignWorkout(id, {
        ...workoutForm,
        EstimatedDuration: parseInt(workoutForm.EstimatedDuration) || 45,
      });
      toast.success('Workout assigned');
      setShowWorkout(false);
      setWorkoutForm({ Title: '', Type: 'Strength', Difficulty: 'Intermediate', EstimatedDuration: 45, Exercises: [] });
    } catch {
      toast.error('Failed to assign workout');
    } finally {
      setSaving(false);
    }
  };

  const handleSetGoal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setClientGoal(id, {
        ...goalForm,
        TargetValue: goalForm.TargetValue ? parseFloat(goalForm.TargetValue) : undefined,
        EndDate: goalForm.EndDate || undefined,
      });
      toast.success('Goal set');
      setShowGoal(false);
      setGoalForm({ Title: '', Type: 'Custom', TargetValue: '', Unit: '', EndDate: '' });
    } catch {
      toast.error('Failed to set goal');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      const { data } = await addClientNote(id, noteText);
      setClient(data?.data || client);
      setNoteText('');
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSaving(true);
    try {
      await sendMessageToClient(id, messageText);
      toast.success('Message sent');
      setShowMessage(false);
      setMessageText('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <TrainerLayout pageTitle="Client Details">
        <div className="space-y-6"><Skeleton type="card" /><Skeleton type="rect" /></div>
      </TrainerLayout>
    );
  }

  if (!client) {
    return (
      <TrainerLayout pageTitle="Client Details">
        <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">Client not found.</p></Card>
      </TrainerLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'actions', label: 'Actions' },
  ];

  return (
    <TrainerLayout pageTitle="">
      <button onClick={() => navigate('/trainer/clients')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back to Clients
      </button>

      <Card className="mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-violet-500/20">
            {client.Profile?.ProfilePicture ? (
              <img src={client.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-violet-500">{(client.Profile?.Name || client.Username || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{client.Profile?.Name || client.Username}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{client.Username} • {client.Email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant={client.IsActive ? 'green' : 'red'}>{client.IsActive ? 'Active' : 'Inactive'}</Badge>
                  {client.Profile?.FitnessLevel && <Badge variant="sky">{client.Profile.FitnessLevel}</Badge>}
                  {client.Profile?.Gender && <Badge variant="gray">{client.Profile.Gender}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={() => setShowWorkout(true)}><FiPlus className="w-3 h-3 mr-1" />Assign Workout</Button>
                <Button size="sm" variant="secondary" onClick={() => setShowGoal(true)}><FiTarget className="w-3 h-3 mr-1" />Set Goal</Button>
                <Button size="sm" variant="secondary" onClick={() => setShowMessage(true)}><FiSend className="w-3 h-3 mr-1" />Message</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${activeTab === tab.id ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Physical Info</h3>
            <div className="grid grid-cols-2 gap-3">
              {client.Profile?.Age && <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Profile.Age}</p><p className="text-xs text-gray-400">Age</p></div>}
              {client.Profile?.Height && <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Profile.Height} cm</p><p className="text-xs text-gray-400">Height</p></div>}
              {client.Profile?.Weight && <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Profile.Weight} kg</p><p className="text-xs text-gray-400">Weight</p></div>}
              {client.Profile?.FitnessLevel && <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Profile.FitnessLevel}</p><p className="text-xs text-gray-400">Level</p></div>}
            </div>
            {client.Profile?.Goals && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Goals:</span> {client.Profile.Goals}</p>}
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Activity Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Stats?.TotalWorkouts || 0}</p><p className="text-xs text-gray-400">Workouts</p></div>
              <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Stats?.TotalCaloriesBurned || 0}</p><p className="text-xs text-gray-400">Calories</p></div>
              <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Stats?.CurrentStreak || 0}</p><p className="text-xs text-gray-400">Streak</p></div>
              <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center"><p className="font-bold text-gray-800 dark:text-gray-100">{client.Stats?.LongestStreak || 0}</p><p className="text-xs text-gray-400">Best Streak</p></div>
            </div>
            <p className="mt-3 text-xs text-gray-400">Last login: {client.LastLogin ? format(new Date(client.LastLogin), 'MMM dd, yyyy') : 'Never'}</p>
          </Card>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Add Note</h3>
            <div className="flex gap-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
                className="form-textarea flex-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                placeholder="Write a note about this client..."
              />
              <Button variant="primary" onClick={handleAddNote} disabled={!noteText.trim()}>
                <FiFileText className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </Card>

          {client.TrainerNotes?.length > 0 ? (
            <div className="space-y-3">
              {[...client.TrainerNotes].reverse().map((note, i) => (
                <Card key={i}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{note.Note}</p>
                      <p className="text-xs text-gray-400 mt-2">{note.TrainerName} • {format(new Date(note.CreatedAt), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card><p className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">No notes yet.</p></Card>
          )}
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex flex-col items-center text-center py-8">
            <div className="w-14 h-14 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center mb-3"><FiPlus className="w-7 h-7" /></div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Assign Workout</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create and assign a workout plan</p>
            <Button variant="primary" onClick={() => setShowWorkout(true)}>Assign</Button>
          </Card>
          <Card className="flex flex-col items-center text-center py-8">
            <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-3"><FiTarget className="w-7 h-7" /></div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Set Goal</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Set a fitness goal for this client</p>
            <Button variant="primary" onClick={() => setShowGoal(true)}>Set Goal</Button>
          </Card>
          <Card className="flex flex-col items-center text-center py-8">
            <div className="w-14 h-14 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center mb-3"><FiMessageSquare className="w-7 h-7" /></div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Send Message</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Send a direct message to client</p>
            <Button variant="primary" onClick={() => setShowMessage(true)}>Message</Button>
          </Card>
        </div>
      )}

      <Modal isOpen={showWorkout} onClose={() => setShowWorkout(false)} title="Assign Workout">
        <form onSubmit={handleAssignWorkout} className="space-y-4">
          <Input label="Title" value={workoutForm.Title} onChange={(e) => setWorkoutForm({ ...workoutForm, Title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={workoutForm.Type} onChange={(e) => setWorkoutForm({ ...workoutForm, Type: e.target.value })} options={[{ value: 'Strength', label: 'Strength' }, { value: 'Cardio', label: 'Cardio' }, { value: 'HIIT', label: 'HIIT' }, { value: 'Yoga', label: 'Yoga' }, { value: 'Flexibility', label: 'Flexibility' }, { value: 'Mixed', label: 'Mixed' }]} />
            <Select label="Difficulty" value={workoutForm.Difficulty} onChange={(e) => setWorkoutForm({ ...workoutForm, Difficulty: e.target.value })} options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]} />
          </div>
          <Input label="Duration (min)" type="number" min="1" value={workoutForm.EstimatedDuration} onChange={(e) => setWorkoutForm({ ...workoutForm, EstimatedDuration: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1" loading={saving}>Assign Workout</Button>
            <Button type="button" variant="secondary" onClick={() => setShowWorkout(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showGoal} onClose={() => setShowGoal(false)} title="Set Goal">
        <form onSubmit={handleSetGoal} className="space-y-4">
          <Input label="Title" value={goalForm.Title} onChange={(e) => setGoalForm({ ...goalForm, Title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={goalForm.Type} onChange={(e) => setGoalForm({ ...goalForm, Type: e.target.value })} options={[{ value: 'Weight-Loss', label: 'Weight Loss' }, { value: 'Muscle-Building', label: 'Muscle Building' }, { value: 'Endurance', label: 'Endurance' }, { value: 'Nutrition', label: 'Nutrition' }, { value: 'Custom', label: 'Custom' }]} />
            <Input label="Target" type="number" step="any" value={goalForm.TargetValue} onChange={(e) => setGoalForm({ ...goalForm, TargetValue: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Unit" value={goalForm.Unit} onChange={(e) => setGoalForm({ ...goalForm, Unit: e.target.value })} placeholder="kg, min..." />
            <Input label="End Date" type="date" value={goalForm.EndDate} onChange={(e) => setGoalForm({ ...goalForm, EndDate: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1" loading={saving}>Set Goal</Button>
            <Button type="button" variant="secondary" onClick={() => setShowGoal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showMessage} onClose={() => setShowMessage(false)} title="Send Message">
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500" placeholder="Type your message..." required />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1" loading={saving}><FiSend className="w-4 h-4 mr-1" />Send</Button>
            <Button type="button" variant="secondary" onClick={() => setShowMessage(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </TrainerLayout>
  );
}

export default ClientDetails;

