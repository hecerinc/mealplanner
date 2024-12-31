from jsonschema import validate

menu_schema = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'minItems': 7,
    'maxItems': 7,
    'type': 'array',
    'items': {
        'type': 'object',
        'properties': {
            'lunch': {
                'type': 'object',
                'properties': {'main': {'type': 'string'}, 'side': {'type': 'string'}, 'soup': {'type': 'string'}},
            },
            'dinner': {
                'type': 'object',
                'properties': {'main': {'type': 'string'}},
            },
        },
        'required': ['lunch', 'dinner'],
    },
}


def validate_menu(menu):
    validate(menu, menu_schema)
