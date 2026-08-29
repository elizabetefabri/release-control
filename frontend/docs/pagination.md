## Paginação Padrão

Todos os endpoints de coleção (listagem) dos resources principais retornam componentes paginadas com a seguinte estrutura:

```json
{
  "data": {
    "items": [/* array de objetos do resource */],
    "pagination": {
      "page": 1,
      "total": 100,
      "limit": 10
    }
  }
}
```

### Query Parameters de Paginação

| Parâmetro | Tipo   | Obrigatório | Descrição                                 |
| --------- | ------ | ----------- | ----------------------------------------- |
| page      | number | Não         | Número da página (default: 1)             |
| limit     | number | Não         | Itens por página (default: 10, max: 100)  |
| pageSize  | number | Não         | Alias para limit (usado se limit ausente) |
