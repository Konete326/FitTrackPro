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
import ConfirmModal from '../../components/common/ConfirmModal';
import { getNutritions, createNutrition, deleteNutrition, getDailySummary, getMyMealPlans } from '../../services/nutritionService';
import { searchPakistaniFoods, getFoodsByMealType } from '../../data/pakistaniFoods';
import { FiPlus, FiTrash2, FiSearch, FiCoffee, FiChevronDown, FiChevronUp, FiEdit3, FiClock, FiX, FiArrowLeft } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const RECENT_FOODS_KEY = 'fittrack_recent_foods';

function NutritionLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dailyTotals, setDailyTotals] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [mealType, setMealType] = useState('Breakfast');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('log');
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [inputMode, setInputMode] = useState('direct'); // 'direct' or 'search'
  const [directFood, setDirectFood] = useState({ Name: '', Calories: '', Protein: '', Carbs: '', Fat: '' });
  const [recentFoods, setRecentFoods] = useState([]);

  // Load recent foods from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_FOODS_KEY);
      if (stored) setRecentFoods(JSON.parse(stored));
    } catch {}
  }, []);

  const saveRecentFood = (foods) => {
    const newItems = foods.map((f) => ({
      Name: f.Name, Calories: f.Calories, Protein: f.Protein, Carbs: f.Carbs, Fat: f.Fat, MealType: mealType, savedAt: Date.now(),
    }));
    setRecentFoods((prev) => {
      const combined = [...newItems, ...prev.filter((f) => !newItems.some((n) => n.Name === f.Name && n.MealType === f.MealType))].slice(0, 50);
      localStorage.setItem(RECENT_FOODS_KEY, JSON.stringify(combined));
      return combined;
    });
  };

  const suggestedFoods = recentFoods.filter((f) => f.MealType === mealType).slice(0, 8);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesRes, summaryRes, plansRes] = await Promise.allSettled([
        getNutritions({ date: selectedDate }),
        getDailySummary(selectedDate),
        getMyMealPlans(),
      ]);
      if (entriesRes.status === 'fulfilled') setEntries(entriesRes.value.data?.data || []);
      if (summaryRes.status === 'fulfilled') setDailyTotals(summaryRes.value.data?.data || null);
      if (plansRes.status === 'fulfilled') setMealPlans(plansRes.value.data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Real-time local food search
  useEffect(() => {
    if (showLogForm && foodSearch.trim().length > 0) {
      const results = searchPakistaniFoods(foodSearch, mealType);
      setFoodResults(results.slice(0, 30));
    } else if (showLogForm && foodSearch.trim().length === 0) {
      const results = getFoodsByMealType(mealType);
      setFoodResults(results.slice(0, 30));
    }
  }, [foodSearch, mealType, showLogForm]);

  const addFood = (food) => {
    setSelectedFoods([...selectedFoods, { Name: food.Name, Calories: food.Calories, Protein: food.Protein, Carbs: food.Carbs, Fat: food.Fat, Quantity: 1 }]);
    setFoodSearch('');
  };

  const addDirectFood = () => {
    if (!directFood.Name.trim()) { toast.error('Enter food name'); return; }
    const cal = Number(directFood.Calories) || 0;
    setSelectedFoods([...selectedFoods, { Name: directFood.Name.trim(), Calories: cal, Protein: Number(directFood.Protein) || 0, Carbs: Number(directFood.Carbs) || 0, Fat: Number(directFood.Fat) || 0, Quantity: 1 }]);
    setDirectFood({ Name: '', Calories: '', Protein: '', Carbs: '', Fat: '' });
  };

  const addFromSuggestion = (food) => {
    setSelectedFoods([...selectedFoods, { Name: food.Name, Calories: food.Calories, Protein: food.Protein || 0, Carbs: food.Carbs || 0, Fat: food.Fat || 0, Quantity: 1 }]);
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
      saveRecentFood(selectedFoods);
      setShowLogForm(false);
      setSelectedFoods([]);
      setDirectFood({ Name: '', Calories: '', Protein: '', Carbs: '', Fat: '' });
      setFoodSearch('');
      fetchData();
    } catch { toast.error('Failed to log meal'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteNutrition(deleteId);
      toast.success('Entry deleted');
      setDeleteId(null);
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const mealColors = { Breakfast: 'violet', Lunch: 'sky', Dinner: 'green', Snack: 'yellow', 'Pre-workout': 'danger', 'Post-workout': 'success' };

  return (
    <>
    <DashboardLayout>
      <PageHeader
        title="Nutrition"
        description="Track meals and view your nutrition plans"
        actions={
          <div className="flex gap-3">
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <Button icon={<FiPlus className="w-4 h-4" />} onClick={() => setShowLogForm(true)}>Log Meal</Button>
          </div>
        }
      />

      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setActiveTab('log')} className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${activeTab === 'log' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          Meal Log
        </button>
        <button onClick={() => setActiveTab('plans')} className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px flex items-center gap-2 ${activeTab === 'plans' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <FiCoffee className="w-4 h-4" /> My Plans
          {mealPlans.length > 0 && <span className="bg-violet-500/10 text-violet-500 text-xs px-1.5 py-0.5 rounded-full">{mealPlans.length}</span>}
        </button>
      </div>

      {activeTab === 'plans' && (
        <>
          {mealPlans.length === 0 ? (
            <Card><EmptyState icon={<FiCoffee className="w-12 h-12" />} title="No meal plans assigned" description="Your trainer hasn't assigned any nutrition plans yet." /></Card>
          ) : (
            <div className="space-y-4">
              {mealPlans.map((plan) => (
                <Card key={plan._id} className="!p-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{plan.Title}</h3>
                          <Badge variant="green">Active</Badge>
                        </div>
                        {plan.Description && <p className="text-sm text-gray-500 dark:text-gray-400">{plan.Description}</p>}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {plan.DietaryPreference && <Badge variant="sky">{plan.DietaryPreference}</Badge>}
                          <Badge variant="gray">{plan.DurationDays} days</Badge>
                          {plan.TargetCalories && <Badge variant="yellow">{plan.TargetCalories} cal/day</Badge>}
                          {plan.TrainerName && <Badge variant="violet">By {plan.TrainerName}</Badge>}
                        </div>
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
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'log' && (
        <>

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
        <Card><EmptyState icon={<FiPlus className="w-16 h-16" />} title="No meals logged" description="Log your first meal for this day" action="Log Meal" onAction={() => setShowLogForm(true)} /></Card>
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
                    <button onClick={() => setDeleteId(entry._id)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
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

      {/* ===== SPLIT PAGE LOG MEAL VIEW ===== */}
      {showLogForm && (
        <div className="mb-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowLogForm(false); setFoodSearch(''); setDirectFood({ Name: '', Calories: '', Protein: '', Carbs: '', Fat: '' }); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition text-gray-500 dark:text-gray-400">
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Log Meal</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(selectedDate), 'EEEE, MMM d')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select options={['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout'].map((v) => ({ value: v, label: v }))} value={mealType} onChange={(e) => setMealType(e.target.value)} />
              <Button onClick={handleSubmit} loading={submitting} disabled={selectedFoods.length === 0}>
                Save Meal ({selectedFoods.length})
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          {suggestedFoods.length > 0 && selectedFoods.length === 0 && (
            <Card className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quick picks for {mealType}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedFoods.map((food, i) => (
                  <button key={i} type="button" onClick={() => addFromSuggestion(food)} className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-violet-500 hover:text-white transition">
                    {food.Name} <span className="text-gray-400 dark:text-gray-500">({food.Calories} cal)</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Split Layout: Left = Quick Add + Selected, Right = Search Database */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: Quick Add + Selected Foods */}
            <div className="space-y-4">
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <FiEdit3 className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Quick Add</h3>
                    <p className="text-xs text-gray-400">Enter custom food manually</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Input label="Food Name" placeholder="e.g., Chicken Biryani" value={directFood.Name} onChange={(e) => setDirectFood({ ...directFood, Name: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Calories" type="number" placeholder="kcal" value={directFood.Calories} onChange={(e) => setDirectFood({ ...directFood, Calories: e.target.value })} />
                    <Input label="Protein" type="number" placeholder="g" value={directFood.Protein} onChange={(e) => setDirectFood({ ...directFood, Protein: e.target.value })} />
                    <Input label="Carbs" type="number" placeholder="g" value={directFood.Carbs} onChange={(e) => setDirectFood({ ...directFood, Carbs: e.target.value })} />
                    <Input label="Fat" type="number" placeholder="g" value={directFood.Fat} onChange={(e) => setDirectFood({ ...directFood, Fat: e.target.value })} />
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={addDirectFood} icon={<FiPlus className="w-4 h-4" />} disabled={!directFood.Name.trim()}>Add to Meal</Button>
                </div>
              </Card>

              {/* Selected Foods */}
              {selectedFoods.length > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Selected Foods ({selectedFoods.length})</h3>
                    <span className="text-xs font-medium text-violet-500">
                      {selectedFoods.reduce((sum, f) => sum + (f.Calories * f.Quantity), 0)} total cal
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedFoods.map((food, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{food.Name}</p>
                          <p className="text-xs text-gray-500">{food.Calories} cal · P:{food.Protein}g C:{food.Carbs}g F:{food.Fat}g</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <input type="number" min="1" value={food.Quantity} onChange={(e) => { const f = [...selectedFoods]; f[i].Quantity = Number(e.target.value) || 1; setSelectedFoods(f); }} className="w-14 form-input text-center bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded text-sm" />
                          <button onClick={() => removeFood(i)} className="p-1 text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* RIGHT COLUMN: Search Desi Foods Database */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                    <FiSearch className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Desi Food Database</h3>
                    <p className="text-xs text-gray-400">100+ Pakistani foods · click to add</p>
                  </div>
                </div>
              </div>
              <Input placeholder="Search biryani, daal, roti, paratha..." value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)} icon={<FiSearch className="w-4 h-4" />} />
              <div className="mt-3 border border-gray-200 dark:border-gray-700/60 rounded-lg max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/40">
                {foodResults.length > 0 ? (
                  foodResults.map((food, i) => (
                    <button key={i} type="button" onClick={() => addFood(food)} className="w-full text-left px-3 py-2.5 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition flex items-center justify-between group">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{food.Name}</span>
                        <div className="flex gap-2 mt-0.5 text-[10px] text-gray-400">
                          <span>P:{food.Protein}g</span>
                          <span>C:{food.Carbs}g</span>
                          <span>F:{food.Fat}g</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{food.Calories} cal</span>
                        <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <FiPlus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No foods found</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
        </>
      )}

    </DashboardLayout>
    <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Meal Entry" message="Are you sure you want to delete this meal entry?" />
    </>
  );
}

export default NutritionLog;
