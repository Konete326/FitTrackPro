import React, { useState, useEffect, useCallback } from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import MealPlanForm from '../../components/common/MealPlanForm';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientMealPlans, createClientMealPlan, updateClientMealPlan, deleteClientMealPlan, toggleClientMealPlan } from '../../services/trainerService';
import { getClientDetails } from '../../services/trainerService';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function ClientMealPlans() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [clientRes, plansRes] = await Promise.allSettled([getClientDetails(id), getClientMealPlans(id)]);
      if (clientRes.status === 'fulfilled') setClient(clientRes.value.data?.data || null);
      if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data?.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editPlan) {
        await updateClientMealPlan(id, editPlan._id, payload);
        toast.success('Meal plan updated');
      } else {
        await createClientMealPlan(id, payload);
        toast.success('Meal plan created');
      }
      setShowForm(false);
      setEditPlan(null);
      fetchData();
    } catch {
      toast.error(editPlan ? 'Failed to update plan' : 'Failed to create plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClientMealPlan(id, deleteId);
      toast.success('Meal plan deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete plan');
    }
  };

  const handleToggle = async (planId, currentActive) => {
    try {
      await toggleClientMealPlan(id, planId, !currentActive);
      toast.success(currentActive ? 'Plan deactivated' : 'Plan activated');
      fetchData();
    } catch {
      toast.error('Failed to toggle plan');
    }
  };

  const openEdit = (plan) => { setEditPlan(plan); setShowForm(true); };
  const openCreate = () => { setEditPlan(null); setShowForm(true); };

  if (loading) {
    return (
      <TrainerLayout pageTitle="Meal Plans">
        <div className="space-y-6"><Skeleton type="card" /><Skeleton type="rect" /></div>
      </TrainerLayout>
    );
  }

  return (
    <TrainerLayout pageTitle="">
      <button onClick={() => navigate(`/trainer/clients/${id}`)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back to Client
      </button>

      {client && (
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden shrink-0">
              {client.Profile?.ProfilePicture ? (
                <img src={client.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-violet-500">{(client.Profile?.Name || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{client.Profile?.Name || client.Username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nutrition Plans</p>
            </div>
            <Button icon={<FiPlus className="w-4 h-4" />} onClick={openCreate}>Create Plan</Button>
          </div>
        </Card>
      )}

      {plans.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiPlus className="w-12 h-12" />}
            title="No meal plans yet"
            description="Create a customized nutrition plan for this client"
            action="Create Plan"
            onAction={openCreate}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan._id} className="!p-0">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{plan.Title}</h3>
                      <Badge variant={plan.IsActive ? 'green' : 'gray'}>{plan.IsActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                    {plan.Description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{plan.Description}</p>}
                    <div className="flex flex-wrap gap-2">
                      {plan.DietaryPreference && <Badge variant="sky">{plan.DietaryPreference}</Badge>}
                      <Badge variant="gray">{plan.DurationDays} days</Badge>
                      {plan.TargetCalories && <Badge variant="yellow">{plan.TargetCalories} cal/day</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <button onClick={() => handleToggle(plan._id, plan.IsActive)} className="p-2 text-gray-400 hover:text-violet-500 transition" title={plan.IsActive ? 'Deactivate' : 'Activate'}>
                      {plan.IsActive ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => openEdit(plan)} className="p-2 text-gray-400 hover:text-sky-500 transition"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(plan._id)} className="p-2 text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <button onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)} className="flex items-center gap-2 text-sm text-violet-500 hover:text-violet-600 font-medium">
                  {expandedPlan === plan._id ? 'Hide' : 'View'} Schedule
                  {expandedPlan === plan._id ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>

                {expandedPlan === plan._id && (
                  <div className="mt-4 space-y-2">
                    {plan.Days?.map((day, dayIdx) => (
                      <div key={dayIdx} className="border border-gray-200 dark:border-gray-700/60 rounded-lg overflow-hidden">
                        <button onClick={() => setExpandedDay(expandedDay === `${plan._id}-${dayIdx}` ? null : `${plan._id}-${dayIdx}`)} className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{day.DayOfWeek}</span>
                          <div className="flex items-center gap-3">
                            {day.DailyCalories > 0 && <span className="text-xs text-gray-400">{day.DailyCalories} cal</span>}
                            <span className="text-xs text-gray-400">{day.Meals?.length || 0} meals</span>
                            {expandedDay === `${plan._id}-${dayIdx}` ? <FiChevronUp className="w-3 h-3 text-gray-400" /> : <FiChevronDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </button>
                        {expandedDay === `${plan._id}-${dayIdx}` && (
                          <div className="p-3 space-y-3">
                            {day.Meals?.map((meal, mealIdx) => (
                              <div key={mealIdx} className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="violet">{meal.MealType}</Badge>
                                  {meal.Time && <span className="text-xs text-gray-400">{meal.Time}</span>}
                                </div>
                                <div className="space-y-1">
                                  {meal.FoodItems?.map((food, foodIdx) => (
                                    <div key={foodIdx} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-700 dark:text-gray-300">{food.Name} <span className="text-gray-400 text-xs">({food.Quantity})</span></span>
                                      <span className="text-xs text-gray-400">{food.Calories} cal · P:{food.Protein}g C:{food.Carbs}g F:{food.Fat}g</span>
                                    </div>
                                  ))}
                                </div>
                                {meal.Instructions && <p className="text-xs text-gray-400 mt-2 italic">{meal.Instructions}</p>}
                                <div className="flex gap-3 mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/60 pt-2">
                                  <span>{meal.TotalCalories || 0} cal</span>
                                  <span>P: {meal.TotalProtein || 0}g</span>
                                  <span>C: {meal.TotalCarbs || 0}g</span>
                                  <span>F: {meal.TotalFat || 0}g</span>
                                </div>
                              </div>
                            ))}
                            {day.Notes && <p className="text-xs text-gray-400 italic px-1">{day.Notes}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3">Created {format(new Date(plan.createdAt), 'MMM dd, yyyy')}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditPlan(null); }} title={editPlan ? 'Edit Meal Plan' : 'Create Meal Plan'} size="xl" footer={null}>
        <MealPlanForm initialData={editPlan} onSubmit={handleSubmit} loading={saving} onClose={() => { setShowForm(false); setEditPlan(null); }} />
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Meal Plan" message="Are you sure you want to delete this meal plan? This cannot be undone." />
    </TrainerLayout>
  );
}

export default ClientMealPlans;
