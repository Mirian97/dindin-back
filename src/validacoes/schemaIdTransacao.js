const joi = require("joi");

const schemaIdTransacao = joi.object({
    idTransacao: joi.number().positive().required().messages({
        "any.required": "O id da transação é obrigatório",
        "number.base": "O id da transação deve ser um numero válido",
        "number.positive": "O id da transação deve ser um numero positivo"
    })
})

module.exports = schemaIdTransacao;