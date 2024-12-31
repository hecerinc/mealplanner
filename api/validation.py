from jsonschema import validate

menu_schema = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'minItems': 7,
    'maxItems': 7,
    'type': 'array',
    'items': {
        'type': 'object',
        'properties': {
            'comida': {
                'type': 'object',
                'properties': {
                    'principales': {'type': 'string'},
                    'side': {'type': 'string'},
                    'sopas': {'type': 'string'},
                },
            },
            'cena': {
                'type': 'object',
                'properties': {'principales': {'type': 'string'}},
            },
        },
        'required': ['comida', 'cena'],
    },
}


def validate_menu(menu):
    validate(menu, menu_schema)
