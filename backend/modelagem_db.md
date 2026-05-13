### Tabela: ``usuarios``

* ``id`` (PK)

* ``nome``

* ``email`` (já pensando no login)

* ``senha`` (armazenar o hash)

### Tabela: ``exercicios`` (O Catálogo)

* ``id`` (PK)

* ``nome`` (ex: Agachamento, Rosca Direta)

* ``grupo_muscular`` (ex: Pernas, Bíceps)

### Tabela: rotinas (O Agrupador)

* ``id`` (PK)

* ``usuario_id`` (FK apontando para usuarios)

* ``nome_rotina`` (ex: "Treino de Segunda", "Full Body")

* ``dia_da_semana`` (Opcional: se quiser fixar um dia)

### Tabela: ``rotina_exercicios`` (O Coração)

* ``id`` (PK)

* ``rotina_id`` (FK)

* ``exercicio_id`` (FK)

* ``series`` (ex: 3)

* ``repeticoes`` (ex: 12)

* ``ordem`` (Para saber qual exercício vem primeiro)
