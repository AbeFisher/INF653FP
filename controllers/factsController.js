const status = require('../config/statusCodes');
const Fact = require('../models/Fact');
const states = require('../models/states.json');

const getFacts = async (req, res) => {
    const state = states.find(st => st.code == req.params.state);
    const result = await Fact.findOne({stateCode: state.code});

    if (result) {
        return res.status(status.Success).json(result.funfacts);
    }
    else {
        return res.status(status.No_Content).json({ 'message': `No fun facts found for ${state.state}`});
    }
}


const getRandom = async (req, res) => {
    let code = '';
    if (req.params.state) {
        code = req.params.state.toUpperCase();
    }

    const state = states.find(st => st.code == code);

    if (!state) {
        return res.status(status.Bad_Request).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    const fact = await Fact.findOne({stateCode: state.code}).exec();
    if (!fact) {
        return res.status(status.Not_Found).json({ 'message': `No Fun Facts found for ${state.state}` });
    }
    else {
        if (fact.funfacts.length) {
            const n = Math.floor(Math.random() * fact.funfacts.length);
            return res.status(status.Success).json({"funfact": fact.funfacts[n]});
        }
        else {
            return res.status(status.Not_Found).json({ 'message': `No Fun Facts found for ${state.state}` });
        }    
    }
}


const addFacts = async (req, res) => {
    //  Validate state parameter
    const state = states.find(st => st.code == req.params.state);
    if (!state) {
        return res.status(status.Bad_Request).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    
    //  Validate data sent with POST request
    if (!req?.body?.funfacts) {
        return res.status(status.Bad_Request).json({ 'message': 'State fun facts value required' });
    }

    //  Validate that funfacts data is an array
    if (!Array.isArray(req.body.funfacts)) {
        return res.status(status.Bad_Request).json({ 'message': 'State fun facts value must be an array'})
    }

    //  if no record exists in facts table for this state, create it
    const fact = await Fact.findOne({stateCode: req.params.state}).exec();

    if (!fact) {
        try {
            const result = await Fact.create({
                stateCode: state.code,
                funfacts: req.body.funfacts
            });
            res.status(status.Created).json(result);
        } catch (err) {
            console.error(err);
        }
    }
    else {
        //  if some fun facts already exist for this state, append new data
        for(let i = 0; i < req.body.funfacts.length; i++) {
            fact.funfacts.push(req.body.funfacts[i]);
        };

        try {
            const result = await fact.save();
            res.status(status.Created).json(result);
        } catch (err) {
            console.error(err);
        }
    }
}


const updateFact = async (req, res) => {
    //  Validate state parameter
    const state = states.find(st => st.code == req.params.state);
    if (!state) {
        return res.status(status.Bad_Request).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    
    //  validate index parameter
    if (!req?.body?.index) {
        return res.status(status.Bad_Request).json({ 'message': 'State fun fact index value required' });
    }

    const index = parseInt(req.body.index);
    if (isNaN(index)) {
        return res.status(status.Bad_Request).json({ 'message': 'Invalid index parameter' });
    }

    //  validate funfact parameter
    if (!req?.body?.funfact) {
        return res.status(status.Bad_Request).json({ 'message': 'State fun fact value required' });
    }

    const fact = await Fact.findOne({stateCode: req.params.state}).exec();    
    //  validate requested fact to update
    if (!fact) {
        const state = states.find(st => st.code == req.params.state);
        return res.status(status.Not_Found).json({ 'message': `No Fun Facts found for ${state.state}` });
    }

    if (!fact?.funfacts[index-1]) {
        return res.status(status.Bad_Request).json({ 'message': `No Fun Fact found at that index for ${state.state}` });
    } 

    //  update and save
    fact.funfacts[index-1] = req.body.funfact;
    
    const result = await fact.save();
    res.json(result);
}


const deleteFact = async (req, res) => {
    //  Validate state parameter
    const state = states.find(st => st.code == req.params.state);
    if (!state) {
        return res.status(status.Bad_Request).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    
    //  validate index parameter
    if (!req?.body?.index) {
        return res.status(status.Bad_Request).json({ 'message': 'State fun fact index value required' });
    }

    const index = parseInt(req.body.index);
    if (isNaN(index)) {
        return res.status(status.Bad_Request).json({ 'message': 'Invalid index parameter' });
    }

    const fact = await Fact.findOne({stateCode: req.params.state}).exec();
    //  validate requested fact to update
    if (!fact) {
        const state = states.find(st => st.code == req.params.state);
        return res.status(status.Not_Found).json({ 'message': `No Fun Facts found for ${state.state}` });
    }

    if (!fact?.funfacts[index-1]) {
        return res.status(status.Bad_Request).json({ 'message': `No Fun Fact found at that index for ${state.state}` });
    } 

    //  remove item from array stored in memory
    fact.funfacts.splice(index-1, 1);

    //  save array to DB
    const result = await fact.save();
    res.json(result);
}

module.exports = {
    getFacts,
    getRandom,
    addFacts,
    updateFact,
    deleteFact
}