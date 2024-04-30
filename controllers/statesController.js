const status = require('../config/statusCodes');
const Fact = require('../models/Fact');
const states = require('../models/states.json');

const getStates = async (req, res) => {
    let results = [];

    //  Handle the various values of the contig query parameter
    switch (req.query.contig) {
        case undefined:
            //  if contig parameter is not provided at all, 
            //  return data for all states
            results = states;
            break;

        case "true":
            results = states.filter(st => (st.code !== "AK" && st.code !== "HI"));
            break;

        case "false":
            results = states.filter(st => (st.code === "AK" || st.code === "HI"));
            break;

        default:
            //  If contig parameter is present, but neither 
            //  "true" nor "false", return error msg
            return res.status(status.Bad_Request).json({ "message": "Invalid 'contig' parameter."});
    }

    //  add funfacts (if any) to the end of state objects
    let facts = [];     // array of fact objects from facts table 
    for (let i = 0; i < results.length; i++) {
        facts = await Fact.findOne({stateCode: results[i].code}).exec();
        
        let factArray = [];     // array of just the facts, not whole object
        if (facts?.funfacts) {
            facts.funfacts.forEach((fact) => {
                factArray.push(fact);
            });
         
            //  Append array of fun facts (not objects) to end of state object
            results[i] = { ...results[i], 'funfacts': factArray };
        }
    }

    //  return the state data with fun facts attached
    return res.status(status.Success).json(results);

}

const getState = async (req, res) => {
    let result = states.find(st => st.code === getStateCode());
    if (!result) {
        res.status(status.Not_Found);
        return res.json({ 'message': 'Invalid state abbreviation parameter'});
    }

    //  add funfacts (if any) to the end of state object
    const facts = await Fact.findOne({stateCode: result.code}).exec();
    let factArray = [];

    if (facts?.funfacts) {
        facts.funfacts.forEach((fact) => {
            factArray.push(fact);
        });

        result = { ...result, 'funfacts': factArray };
    }

    return res.json(result);
}

const getCapital = (req, res) => {
    const state = states.find(st => st.code == getStateCode());
    return res.json({state: state.state, capital: state.capital_city});
}

const getNickname = (req, res) => {
    const state = states.find(st => st.code == getStateCode());
    return res.json({state: state.state, capital: state.nickname});
}

const getPopulation = (req, res) => {
    const state = states.find(st => st.code == getStateCode());
    return res.json({state: state.state, capital: state.population});
}

const getAdmission = (req, res) => {
    const state = states.find(st => st.code == getStateCode());
    return res.json({state: state.state, capital: state.admission_date});
}

const getStateCode = () => {
    let code = '';
    if (req.params.state) {
        code = req.params.state.toUpperCase();
    }
    return code;
}

module.exports = {
    getStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
}