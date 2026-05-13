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

### /api/v1/exercicios/
* __GET__: retorna todas os exercícios.
* __POST__: cria um exercício.

### /api/v1/exercicios/pk/
* __GET__: retorna o exercício com o id especificado.
* __PATCH__: atualiza um campo do exercício.
* __DELETE__: deleta o exercício.

### /api/v1/rotinasexercicios/fk (nci(nci(rotina)
* __GET__: retorna todas os exercícios, sua ordem e seu número de séries relacionados á rotina.
* __PATCH__: atualiza um campo.
* __DELETE__: deleta a tupla relacionada.

