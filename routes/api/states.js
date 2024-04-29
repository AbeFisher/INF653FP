const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const factsController = require('../../controllers/factsController');

router.route('/').get(statesController.getStates);

router.route('/:state').get(statesController.getState);
router.route('/:state/funfact')
    .get(factsController.getRandom)
    .post(factsController.addFacts)
    .patch(factsController.updateFact)
    .delete(factsController.deleteFact);
    
router.route('/:state/funfacts').get(factsController.getFacts);
router.route('/:state/capital').get(statesController.getCapital);
router.route('/:state/nickname').get(statesController.getNickname);
router.route('/:state/population').get(statesController.getPopulation);
router.route('/:state/admission').get(statesController.getAdmission);

router.route('/?contig').get(statesController.getStates);

module.exports = router;