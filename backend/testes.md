## Classe UsuarioTests:
Testes gerais para todos os modelos.
* __test_exercicio_model__ <br>
  Testa se a instância de __Exercicio__ foi criada corretamente.
* __test_rotina_model__ <br>
  Testa se a instância de __Rotina__ foi criada corretamente.
* __test_rotina_exercicio_model__ <br>
  Testa se a instância de __RotinaExercicio__ foi criada corretamente.

## Classe RotinaAPITest:
Testes específicos para a classe Rotina.
* __test_acessar_rotinas_sem_token_retorna_401__ <br>
  Testa se a API bloqueia o acesso da rota sem o usuário estar logado.
* __test_acessar_rotinas_com_token_retorna_200__ <br>
  Testa se a API libera o acesso para o usuário logado.
* __test_criar_rotina_com_dados_validos__ <br>
  Testa se a criação de uma rotina é feita com sucesso.
* __test_criar_rotina_sem_nome_retorna_erro__ <br>
  Testa se a API só cria uma instância com os dados validados.
* __test_detalhe_rotina_com_sucesso__ <br>
  Testa se os detalhes de uma rotina existente são retornados.
* __test_detalhe_rotina_nao_encontrada__ <br>
  Testa se a API retorna um erro se a rotina não existe.
