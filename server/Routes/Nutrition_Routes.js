const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  create_Nutrition,
  get_Nutritions,
  updateNutrition,
  deleteNutrition,
  searchFoods,
  createFood,
} = require('../Controllers/Nutrition_Controller');
const { getMyMealPlans, getMyMealPlanById } = require('../Controllers/MealPlanUser_Controller');

router.use(protect);

router.route('/')
  .post(create_Nutrition)
  .get(get_Nutritions);

router.route('/:id')
  .put(idParamValidation, updateNutrition)
  .delete(idParamValidation, deleteNutrition);

router.get('/foods/search', searchFoods);
router.post('/foods', createFood);

router.get('/meal-plans', getMyMealPlans);
router.get('/meal-plans/:id', getMyMealPlanById);

module.exports = router;
