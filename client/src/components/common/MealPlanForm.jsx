import React, { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Modal from './Modal';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'];
const DIET_OPTIONS = ['Standard', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 'Low-Carb', 'High-Protein'];

const emptyFoodItem = () => ({ Name: '', Quantity: '1 serving', Calories: 0, Protein: 0, Carbs: 0, Fat: 0 });
const emptyMeal = (type) => ({ MealType: type, Time: '', FoodItems: [emptyFoodItem()], Instructions: '' });
const emptyDay = (day) => ({ DayOfWeek: day, Meals: [emptyMeal('Breakfast'), emptyMeal('Lunch'), emptyMeal('Dinner')], Notes: '' });

function MealPlanForm({ initialData, onSubmit, loading, onClose }) {
  const [form, setForm] = useState({
    Title: initialData?.Title || '',
    Description: initialData?.Description || '',
    DurationDays: initialData?.DurationDays || 7,
    DietaryPreference: initialData?.DietaryPreference || 'Standard',
    TargetCalories: initialData?.TargetCalories || '',
    TargetProtein: initialData?.TargetProtein || '',
    TargetCarbs: initialData?.TargetCarbs || '',
    TargetFat: initialData?.TargetFat || '',
    Days: initialData?.Days?.length ? initialData.Days : DAYS.map(emptyDay),
  });
  const [expandedDays, setExpandedDays] = useState([0]);
  const [expandedMeals, setExpandedMeals] = useState({});

  const toggleDay = (idx) => setExpandedDays((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  const toggleMeal = (key) => setExpandedMeals((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateMealField = (dayIdx, mealIdx, field, value) => {
    const days = [...form.Days];
    days[dayIdx].Meals[mealIdx][field] = value;
    setForm({ ...form, Days: days });
  };

  const updateFoodItem = (dayIdx, mealIdx, foodIdx, field, value) => {
    const days = [...form.Days];
    days[dayIdx].Meals[mealIdx].FoodItems[foodIdx][field] = field === 'Name' || field === 'Quantity' ? value : Number(value) || 0;
    setForm({ ...form, Days: days });
  };

  const addFoodItem = (dayIdx, mealIdx) => {
    const days = [...form.Days];
    days[dayIdx].Meals[mealIdx].FoodItems.push(emptyFoodItem());
    setForm({ ...form, Days: days });
  };

  const removeFoodItem = (dayIdx, mealIdx, foodIdx) => {
    const days = [...form.Days];
    days[dayIdx].Meals[mealIdx].FoodItems.splice(foodIdx, 1);
    setForm({ ...form, Days: days });
  };

  const addMeal = (dayIdx) => {
    const days = [...form.Days];
    days[dayIdx].Meals.push(emptyMeal('Snack'));
    setForm({ ...form, Days: days });
  };

  const removeMeal = (dayIdx, mealIdx) => {
    const days = [...form.Days];
    days[dayIdx].Meals.splice(mealIdx, 1);
    setForm({ ...form, Days: days });
  };

  const updateDayNotes = (dayIdx, value) => {
    const days = [...form.Days];
    days[dayIdx].Notes = value;
    setForm({ ...form, Days: days });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Title.trim()) return;
    const payload = {
      ...form,
      DurationDays: Number(form.DurationDays) || 7,
      TargetCalories: Number(form.TargetCalories) || undefined,
      TargetProtein: Number(form.TargetProtein) || undefined,
      TargetCarbs: Number(form.TargetCarbs) || undefined,
      TargetFat: Number(form.TargetFat) || undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Plan Title" value={form.Title} onChange={(e) => updateField('Title', e.target.value)} required placeholder="e.g., 7-Day Cutting Plan" />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea value={form.Description} onChange={(e) => updateField('Description', e.target.value)} rows={2} className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg" placeholder="Describe the plan goals..." />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Select label="Diet" value={form.DietaryPreference} onChange={(e) => updateField('DietaryPreference', e.target.value)} options={DIET_OPTIONS.map((v) => ({ value: v, label: v }))} />
        <Input label="Duration (days)" type="number" min="1" value={form.DurationDays} onChange={(e) => updateField('DurationDays', e.target.value)} />
        <Input label="Target Cal" type="number" value={form.TargetCalories} onChange={(e) => updateField('TargetCalories', e.target.value)} placeholder="2000" />
        <Input label="Target Protein (g)" type="number" value={form.TargetProtein} onChange={(e) => updateField('TargetProtein', e.target.value)} placeholder="150" />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Weekly Schedule</h4>
        {form.Days.map((day, dayIdx) => (
          <div key={dayIdx} className="border border-gray-200 dark:border-gray-700/60 rounded-lg overflow-hidden">
            <button type="button" onClick={() => toggleDay(dayIdx)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition">
              <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{day.DayOfWeek}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{day.Meals.length} meal{day.Meals.length !== 1 ? 's' : ''}</span>
                {expandedDays.includes(dayIdx) ? <FiChevronUp className="w-4 h-4 text-gray-400" /> : <FiChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
            {expandedDays.includes(dayIdx) && (
              <div className="p-4 space-y-4">
                {day.Meals.map((meal, mealIdx) => {
                  const mealKey = `${dayIdx}-${mealIdx}`;
                  return (
                    <div key={mealIdx} className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Select value={meal.MealType} onChange={(e) => updateMealField(dayIdx, mealIdx, 'MealType', e.target.value)} options={MEAL_TYPES.map((v) => ({ value: v, label: v }))} className="w-40" />
                          <Input type="time" value={meal.Time || ''} onChange={(e) => updateMealField(dayIdx, mealIdx, 'Time', e.target.value)} className="w-32" />
                        </div>
                        {day.Meals.length > 1 && (
                          <button type="button" onClick={() => removeMeal(dayIdx, mealIdx)} className="text-red-400 hover:text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {meal.FoodItems.map((food, foodIdx) => (
                          <div key={foodIdx} className="flex gap-2 items-start flex-wrap">
                            <Input placeholder="Food name" value={food.Name} onChange={(e) => updateFoodItem(dayIdx, mealIdx, foodIdx, 'Name', e.target.value)} className="flex-1 min-w-[120px]" />
                            <Input placeholder="Qty" value={food.Quantity} onChange={(e) => updateFoodItem(dayIdx, mealIdx, foodIdx, 'Quantity', e.target.value)} className="w-24" />
                            <Input placeholder="Cal" type="number" value={food.Calories} onChange={(e) => updateFoodItem(dayIdx, mealIdx, foodIdx, 'Calories', e.target.value)} className="w-20" />
                            <Input placeholder="P" type="number" value={food.Protein} onChange={(e) => updateFoodItem(dayIdx, mealIdx, foodIdx, 'Protein', e.target.value)} className="w-16" />
                            <Input placeholder="C" type="number" value={food.Carbs} onChange={(e) => updateFoodItem(dayIdx, mealIdx, foodIdx, 'Carbs', e.target.value)} className="w-16" />
                            <Input placeholder="F" type="number" value={food.Fat} onChange={(e) => updateFoodItem(dayIdx, mealIdx, foodIdx, 'Fat', e.target.value)} className="w-16" />
                            {meal.FoodItems.length > 1 && (
                              <button type="button" onClick={() => removeFoodItem(dayIdx, mealIdx, foodIdx)} className="text-red-400 hover:text-red-500 mt-2"><FiTrash2 className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={() => addFoodItem(dayIdx, mealIdx)} className="text-xs text-violet-500 hover:text-violet-600 font-medium"><FiPlus className="w-3 h-3 inline mr-1" />Add Food</button>
                      </div>
                      <Input placeholder="Instructions (optional)" value={meal.Instructions || ''} onChange={(e) => updateMealField(dayIdx, mealIdx, 'Instructions', e.target.value)} />
                    </div>
                  );
                })}
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => addMeal(dayIdx)} className="text-xs text-violet-500 hover:text-violet-600 font-medium"><FiPlus className="w-3 h-3 inline mr-1" />Add Meal</button>
                  <div className="flex-1">
                    <Input placeholder="Day notes (optional)" value={day.Notes || ''} onChange={(e) => updateDayNotes(dayIdx, e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1" loading={loading}>
          {initialData?._id ? 'Update Plan' : 'Create Plan'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

export default MealPlanForm;
