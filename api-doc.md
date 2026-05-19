## Fluxo:
1. __Criar a "casca" da Rotina__<br>
    O usuário digita o nome do treino e clica em salvar. O front-end faz um ``POST`` para a rota principal:

    * __POST__ ``/rotinas/``

    * __Body:__ ``{"nome": "Treino de Peito"}``

2. __O Back-end devolve o ID__<br>
    A API vai criar a rotina no banco e devolver os dados dela, incluindo o __ID gerado__:

    * __Response:__ ``{"id": 14, "nome": "Treino de Peito"}``

3. __Adicionar os Exercícios__<br>
    Agora o front-end sabe que a rotina é a de número ``14``. Quando o usuário for escolhendo os exercícios, o front-end vai fazer requisições para a rota aninhada usando o ID que acabou de receber:

    __POST__ ``/rotinas/14/exercicios/``

    __Body:__ ``{"exercicio": 5, "series": 4, "repeticoes": 10}``

## Rotas

### /api/v1/
* __GET__: retorna todos os usuários.
* __POST__: cria um usuário.

### /api/v1/pk/
* __GET__: retorna o usuário com o id especificado.
* __PATCH__: atualiza um campo do usuário.
* __DELETE__: deleta o usário.

### /api/v1/rotinas/
* __GET__: retorna todas as rotinas.
* __POST__: cria uma rotina.

### /api/v1/rotinas/pk/
* __GET__: retorna a rotina com o id especificado.
* __PATCH__: atualiza um campo da rotina.
* __DELETE__: deleta a rotina.

### /api/v1/rotinas/\<pk:rotina_id\>/exercicios/
* __GET__: retorna os exercícios da rotina com o id especificado.
* __POST__: adiciona um exercício à rotina.

### /api/v1/exercicios/
* __GET__: retorna todas os exercícios.
* __POST__: cria um exercício.

### /api/v1/exercicios/pk/
* __GET__: retorna o exercício com o id especificado.
* __PATCH__: atualiza um campo do exercício.
* __DELETE__: deleta o exercício.

### /api/v1/rotinasexercicios/<int:pk>
* __GET__: retorna a relação contendo a rotina, todas os exercícios relacionados, sua ordem e seu número de séries.
* __PATCH__: atualiza um campo.
* __DELETE__: deleta a tupla relacionada.

