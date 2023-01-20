const joi = require("joi");

const schemaTransacao = joi.object({
    descricao: joi.string().required().messages({
        "any.required": "O campo descrição é obrigatório",
        "string.empty": "O campo descrição é obrigatório"
    }),
    valor: joi.number().required().messages({
        "any.required": "O campo valor é obrigatório",
        "number.base": "O campo valor deve receber um numero válido"
    }),
    data: joi.string().required().messages({
        "any.required": "O campo data é obrigatório",
        "string.empty": "O campo data é obrigatório"

    }),
    categoria_id: joi.number().positive().required().messages({
        "any.required": "O id da categoria é obrigatório",
        "number.base": "O id da categoria deve ser um numero válido",
        "number.positive": "O id da categoria deve ser um numero positivo"
    }),
    tipo: joi.string().required().messages({
        "any.required": "O campo tipo é obrigatório",
        "string.empty": "O campo tipo é obrigatório"
    }),
})

module.exports = schemaTransacao;