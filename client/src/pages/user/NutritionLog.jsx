import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getNutritions, createNutrition, deleteNutrition, searchFoods, getDailySummary } from '../../services/nutritionService';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function NutritionLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dailyTotals, setDailyTotals] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [mealType, setMealType] = useState('Breakfast');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesRes, summaryRes] = await Promise.allSettled([
        getNutritions({ date: selectedDate }),
        getDailySummary(selectedDate),
      ]);
      if (entriesRes.status === 'fulfilled') setEntries(entriesRes.value.data?.data || []);
      if (summaryRes.status === 'fulfilled') setDailyTotals(summaryRes.value.data?.data || null);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFoodSearch = async () => {
    if (!foodSearch.trim()) return;
    try {
      const { data } = await searchFoods({ query: foodSearch });
      setFoodResults(data.data || []);
    } catch { toast.error('Failed to search foods'); }
  };

  const addFood = (food) => {
    setSelectedFoods([...selectedFoods, { ...food, Quantity: 1 }]);
    setFoodResults([]);
    setFoodSearch('');
  };

  const removeFood = (index) => setSelectedFoods(selectedFoods.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (selectedFoods.length === 0) { toast.error('Add at least one food item'); return; }
    setSubmitting(true);
    try {
      await createNutrition({
        MealType: mealType,
        Date: selectedDate,
        Time: format(new Date(), 'HH:mm'),
        FoodItems: selectedFoods.map((f) => ({
          Name: f.Name, Quantity: f.Quantity, Calories: f.Calories,
          Protein: f.Protein, Carbs: f.Carbs, Fat: f.Fat,
        })),
      });
      toast.success('Meal logged!');
      setShowModal(false);
      setSelectedFoods([]);
      fetchData();
    } catch { toast.error('Failed to log meal'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNutrition(id);
      toast.success('Entry deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const mealColors = { Breakfast: 'violet', Lunch: 'sky', Dinner: 'green', Snack: 'yellow', 'Pre-workout': 'danger', 'Post-workout': 'success' };

  return (
    <DashboardLayout>
      <PageHeader
        title="Nutrition Log"
        description="Track your daily meals and nutrition"
        actions={
          <div className="flex gap-3">
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <Button icon={<FiPlus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Log Meal</Button>
          </div>
        }
      />

      {dailyTotals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Calories', value: Math.round(dailyTotals.totalCalories || 0), unit: 'kcal', color: 'text-red-500' },
            { label: 'Protein', value: Math.round(dailyTotals.totalProtein || 0), unit: 'g', color: 'text-violet-500' },
            { label: 'Carbs', value: Math.round(dailyTotals.totalCarbs || 0), unit: 'g', color: 'text-sky-500' },
            { label: 'Fat', value: Math.round(dailyTotals.totalFat || 0), unit: 'g', color: 'text-yellow-500' },
          ].map((m, i) => (
            <Card key={i} className="text-center">
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}<span className="text-sm font-normal text-gray-400 ml-1">{m.unit}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{m.label}</p>
            </Card>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} type="rect" />)}</div>
      ) : entries.length === 0 ? (
        <Card><EmptyState icon={<FiPlus className="w-16 h-16" />} title="No meals logged" description="Log your first meal for this day" action="Log Meal" onAction={() => setShowModal(true)} /></Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry._id} className="!p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={mealColors[entry.MealType] || 'default'}>{entry.MealType}</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{entry.Time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{entry.TotalCalories} kcal</span>
                    <button onClick={() => handleDelete(entry._id)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.FoodItems?.map((food, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700/30 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                      {food.Name} ({food.Calories} cal)
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-400">
                  <span>P: {Math.round(entry.TotalProtein || 0)}g</span>
                  <span>C: {Math.round(entry.TotalCarbs || 0)}g</span>
                  <span>F: {Math.round(entry.TotalFat || 0)}g</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Meal" size="lg" footer={
        <>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} loading={submitting}>Save Meal</Button>
        </>
      }>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Meal Type" options={['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout'].map((v) => ({ value: v, label: v }))} value={mealType} onChange={(e) => setMealType(e.target.value)} />
            <div className="flex items-end gap-2">
              <Input placeholder="Search food..." value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFoodSearch())} icon={<FiSearch className="w-4 h-4" />} className="flex-1" />
              <Button variant="secondary" size="md" onClick={handleFoodSearch}>Search</Button>
            </div>
          </div>
          {foodResults.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700/60 rounded-lg max-h-40 overflow-y-auto">
              {foodResults.map((food, i) => (
                <button key={i} onClick={() => addFood(food)} className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
                  {food.Name} {food.Brand && <span className="text-gray-400">- {food.Brand}</span>} <span className="text-gray-400">({food.Calories} cal)</span>
                </button>
              ))}
            </div>
          )}
          {selectedFoods.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Foods</p>
              {selectedFoods.map((food, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{food.Name}</p>
                    <p className="text-xs text-gray-500">{food.Calories} cal per serving</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" min="1" value={food.Quantity} onChange={(e) => { const f = [...selectedFoods]; f[i].Quantity = Number(e.target.value) || 1; setSelectedFoods(f); }} className="w-16 form-input text-center bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 rounded text-sm" />
                    <button onClick={() => removeFood(i)} className="text-red-500 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default NutritionLog;
