/*
  ARQUIVO DE DADOS DO CATÁLOGO
  ----------------------------
  Cada coleção tem um campo "type" que define como a navegação funciona:

  1) "ano-disciplina" (ex: Pitanguá, Buriti Raízes)
     Coleção > escolhe o ano > escolhe a disciplina > abre o PDF
     Campos: years -> [{ label, disciplines: [{ name, key, url }] }]

  2) "faixa-direta" (ex: Bit-a-Bit)
     Coleção > escolhe a faixa de anos > abre o PDF direto (sem disciplina)
     Campos: ranges -> [{ label, url }]
     Ex: label "1º e 2º ano" com 1 único PDF, label "3º ao 5º ano" com outro.

  3) "link-unico" (ex: Moderna pelo Brasil)
     Clicar na coleção já abre o PDF direto, sem nenhuma etapa no meio.
     Campos: url -> link direto do PDF

  4) "ano-idioma" (ex: Língua Estrangeira)
     Coleção > escolhe o ano > escolhe o idioma > abre o PDF
     Campos: years -> [{ label, languages: [{ name, key, url }] }]

  Campos comuns a todas: title, description, youtube (ID do vídeo, a parte
  depois de "v=" no link do YouTube), type.

  Use url: null em qualquer PDF ainda não disponível — o site mostra
  "Em breve" automaticamente nesse caso.

  OBS: "Produção de Texto" (dentro de Pitanguá/Buriti Raízes) é a mesma obra
  para 3º, 4º e 5º ano — por isso o mesmo link se repete nos três anos.
*/

const CATALOG = [
  {
    title: "Pitanguá",
    type: "ano-disciplina",
    description: "Coleção para os anos iniciais, com foco em leitura, escrita, oralidade e raciocínio lógico.",
    youtube: "r6g9xwhVsa4",
    years: [
      {
        label: "1º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/18bu9gbcp4htaSMFxRN0OJURqgx1O4oNC/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/1Z_oiZNBFA_MSatVsdBf_5Cu9F78HgRLE/view?usp=drive_link" },
          { name: "CHG", key: "chg", url: "https://drive.google.com/file/d/19oRI1s0Zxl1ECBMaGXXJVHYKnqCF-U8r/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1hPot-zuCpa0GgQozdCRHVGo0vwVI85SQ/view?usp=drive_link" }
        ]
      },
      {
        label: "2º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/1euuHqAPRR9JMzvFgnpqEVAGKc_ogftFS/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/1BJ4jvid2SGN7vzbJ5lXWuuW86y9hEBvx/view?usp=drive_link" },
          { name: "CHG", key: "chg", url: "https://drive.google.com/file/d/1x4a7tlxlvyqrdNvVerdRbUDC9IB2x2nY/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1v9hf9ONQhZjP1lTuXsGBdzpRLBjIIQQ9/view?usp=drive_link" }
        ]
      },
      {
        label: "3º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/1mj8MO-PGa-0-YEucpAX1xI6_iSphlYHP/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/1gi7BPGWK7ZFl5OA1z3UaIhLK7KQkl7yH/view?usp=drive_link" },
          { name: "Ciências", key: "ciencias", url: "https://drive.google.com/file/d/1R3fpohUHLmE_3CGF5EfwUE0g_Pp9IsfX/view?usp=drive_link" },
          { name: "História", key: "historia", url: "https://drive.google.com/file/d/189xvahptsvhH2MwMqN-CiHf7PRHC2k_T/view?usp=drive_link" },
          { name: "Geografia", key: "geografia", url: "https://drive.google.com/file/d/1HVvDhDr1q8SVgWsSoEhRHN8Tg7OKcQCj/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1GePv1fOTkqNznfKsI0Q_01P8BxkU-eVU/view?usp=drive_link" },
          { name: "Produção de Texto", key: "producao-texto", url: "https://drive.google.com/file/d/1rNESqDLLhO2pCchFenmWyEbRBOXUFiAg/view?usp=drive_link" }
        ]
      },
      {
        label: "4º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/1hB2DT3nAXkS0vOgM0B2QdIWAoQnuEX81/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/18tBa-rNvGpM0jdcsH1b2H51I5rH_9dZ0/view?usp=drive_link" },
          { name: "Ciências", key: "ciencias", url: "https://drive.google.com/file/d/1lDrk1A-mkLG14voZzNZq0WCii8vjaRa7/view?usp=drive_link" },
          { name: "História", key: "historia", url: "https://drive.google.com/file/d/1iQn_iZk5NhMHL9WXHswcu7-sDxEcfJxC/view?usp=drive_link" },
          { name: "Geografia", key: "geografia", url: "https://drive.google.com/file/d/1bnTd5crdo-QGd87ysDjingjzQlzTlR8k/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1LwA5NOdsIrC-u9_BELaLja53EJdlpyNl/view?usp=drive_link" },
          { name: "Produção de Texto", key: "producao-texto", url: "https://drive.google.com/file/d/1rNESqDLLhO2pCchFenmWyEbRBOXUFiAg/view?usp=drive_link" }
        ]
      },
      {
        label: "5º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/1Oq-jvoFyLuQbVsF2qMvVUkJBdP3vTDDe/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/1ORJaNb9_x8StJGKIj-E_nuCiGuRuxdOi/view?usp=drive_link" },
          { name: "Ciências", key: "ciencias", url: "https://drive.google.com/file/d/1ILVpjeh7sl8h67SnyhXS-OLZGw3yyKOm/view?usp=drive_link" },
          { name: "História", key: "historia", url: "https://drive.google.com/file/d/1KZP0rknSzi8hHTRl9_1CYd2I_Gilr-Bu/view?usp=drive_link" },
          { name: "Geografia", key: "geografia", url: "https://drive.google.com/file/d/1sQaErh8IHuqWLsOHlYep_m65w4jKqW1-/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1cI4lN95bK_Kk4kQFJDIqhoUFCeyDAWA8/view?usp=drive_link" },
          { name: "Produção de Texto", key: "producao-texto", url: "https://drive.google.com/file/d/1rNESqDLLhO2pCchFenmWyEbRBOXUFiAg/view?usp=drive_link" }
        ]
      }
    ]
  },
  {
    title: "Buriti Raízes",
    type: "ano-disciplina",
    description: "Coleção que valoriza a diversidade cultural brasileira, com abordagem contextualizada.",
    youtube: "nfSbTDySF2s",
    years: [
      {
        label: "1º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/1dje2gbojc9twYlfmI4tTSsZwYI2CAFU1/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/1fjsKV4nvSSXVbL8Ncq0RXKN-rxXwuGyi/view?usp=drive_link" },
          { name: "CHG", key: "chg", url: "https://drive.google.com/file/d/1ccEjpRjW9e9VvN0k6dDZAmlNnePOs4m9/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1UkcV3niwvWb_miUJugTJJKEkbl8apw4I/view?usp=drive_link" }
        ]
      },
      {
        label: "2º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/1k2eLv_1lrQrX5fjKaDzJxqInc-veHpHi/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/10SfYuoM20Bals04qv4wLHRC02iGB3YAN/view?usp=drive_link" },
          { name: "CHG", key: "chg", url: "https://drive.google.com/file/d/1UEJ1REJFh_wvHEuMgIwSqCLiSwf0ttaB/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1Zjbmyw7skGRmukoxzAK4J4lOVXxQESlP/view?usp=drive_link" }
        ]
      },
      {
        label: "3º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/16D8NswMZsZ5y_XhiGXs_xg6ASZ6d35eF/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/14-LuF5whr1VyeIa4AZ2LasxpsORYN5f3/view?usp=drive_link" },
          { name: "Ciências", key: "ciencias", url: "https://drive.google.com/file/d/1Chy1n7HR4xYpEFLy4_vbHBUVDETw0nM0/view?usp=drive_link" },
          { name: "História", key: "historia", url: "https://drive.google.com/file/d/1Hc2omyJj94vBU0Q-7JppG55nzEET80rd/view?usp=drive_link" },
          { name: "Geografia", key: "geografia", url: "https://drive.google.com/file/d/1uNxH_xi2mhmI-MPae0CjtSWIoOtOIdad/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1zGfMLsvDIJD-7SCcPm_IVT9gkHQGBKRd/view?usp=drive_link" },
          { name: "Produção de Texto", key: "producao-texto", url: "https://drive.google.com/file/d/1zwlVrDx0_NcIsFivTOhm9t6GT4lCFUlR/view?usp=drive_link" }
        ]
      },
      {
        label: "4º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/138JCQCZwoKi3Wd5eCQYQh1_eLSoEBaWO/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/1e5i1TU_aqwnHZd4hZtPRUAAXieoX91nm/view?usp=drive_link" },
          { name: "Ciências", key: "ciencias", url: "https://drive.google.com/file/d/1f4jg9fvbdZAdoMdSq4_HJJZ8XVfiZ_oj/view?usp=drive_link" },
          { name: "História", key: "historia", url: "https://drive.google.com/file/d/1urtJx7ouUedr3BPOMB1T6TXulu5BaYbu/view?usp=drive_link" },
          { name: "Geografia", key: "geografia", url: "https://drive.google.com/file/d/1ZSaFZvM5tj-hZsMpMCvKSFrg-8j15EVj/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1GkbJKi7F1-Be6k_-pVmGom3-L8R3sLTW/view?usp=drive_link" },
          { name: "Produção de Texto", key: "producao-texto", url: "https://drive.google.com/file/d/1zwlVrDx0_NcIsFivTOhm9t6GT4lCFUlR/view?usp=drive_link" }
        ]
      },
      {
        label: "5º ano",
        disciplines: [
          { name: "Português", key: "portugues", url: "https://drive.google.com/file/d/1UFO_wsLoZO7APb9eK2Ogq7D-T-3vWTld/view?usp=drive_link" },
          { name: "Matemática", key: "matematica", url: "https://drive.google.com/file/d/14Gs11C5m4UxnhjwxnB_6OlA-lyUHC4EE/view?usp=drive_link" },
          { name: "Ciências", key: "ciencias", url: "https://drive.google.com/file/d/1Sm7jgC1ODzw4m3cvauoP_yUXBtU14c71/view?usp=drive_link" },
          { name: "História", key: "historia", url: "https://drive.google.com/file/d/12o5VcM4MAod2gSJ-C7_oLcLF45EqFnRA/view?usp=drive_link" },
          { name: "Geografia", key: "geografia", url: "https://drive.google.com/file/d/1rMUaICKZAhREgdo4LY3SlQuvFqd8RD8m/view?usp=drive_link" },
          { name: "Artes", key: "artes", url: "https://drive.google.com/file/d/1nrENH6h7u_tlYvIeLE6ACZjdAzTzXNGM/view?usp=drive_link" },
          { name: "Produção de Texto", key: "producao-texto", url: "https://drive.google.com/file/d/1zwlVrDx0_NcIsFivTOhm9t6GT4lCFUlR/view?usp=drive_link" }
        ]
      }
    ]
  },
  {
    title: "Bit-a-Bit",
    type: "faixa-direta",
    description: "Coleção de educação digital, com letramento tecnológico do 1º ao 5º ano.",
    youtube: "Ver991Vd6wQ",
    ranges: [
      { label: "1º e 2º ano", url: "https://drive.google.com/file/d/1f3iPU35TYbZ1y94Ud_Yi0AsmbLoGTFEA/view?usp=drive_link" },
      { label: "3º ao 5º ano", url: "https://drive.google.com/file/d/1pZ0EUCmrUe_8r3B7x2jhVPm5JHFnt2Gb/view?usp=drive_link" }
    ]
  },
  {
    title: "Moderna pelo Brasil",
    type: "link-unico",
    description: "Material regionalizado, com conteúdo adaptado à realidade de cada região do país.",
    youtube: "rtmq4226SX4",
    url: "https://drive.google.com/file/d/15R_Yz4DMiW6AS7W3nA9GGPrJtHQjuoTT/view?usp=drive_link"
  },
  {
    title: "Língua Estrangeira",
    type: "ano-idioma",
    description: "Coleção de inglês e espanhol para os anos iniciais, do 1º ao 5º ano.",
    youtube: "e3KJM7Q58RQ",
    years: [
      {
        label: "1º ano",
        languages: [
          { name: "Inglês", key: "ingles", url: "https://drive.google.com/file/d/1dd9_t0AyIBO1_3vJSJaGXwDAfMaERHdV/view?usp=drive_link" },
          { name: "Espanhol", key: "espanhol", url: "https://drive.google.com/file/d/12owbLpoaRf6uix54nZF7A0dGIbJSTHZ4/view?usp=drive_link" }
        ]
      },
      {
        label: "2º ano",
        languages: [
          { name: "Inglês", key: "ingles", url: "https://drive.google.com/file/d/1gy6m4qBcFJsmKdc0EuBoinmEEtewoKlM/view?usp=drive_link" },
          { name: "Espanhol", key: "espanhol", url: "https://drive.google.com/file/d/1_tth3skz_wboBCvxvBwMisf0FbXoiC4s/view?usp=drive_link" }
        ]
      },
      {
        label: "3º ano",
        languages: [
          { name: "Inglês", key: "ingles", url: "https://drive.google.com/file/d/1AM6JfNN76hoc-y0Fu7zkgPnCriI3x33G/view?usp=drive_link" },
          { name: "Espanhol", key: "espanhol", url: "https://drive.google.com/file/d/1d4EulBCHadAz-lH2RE31FCvbBDwDMMwr/view?usp=drive_link" }
        ]
      },
      {
        label: "4º ano",
        languages: [
          { name: "Inglês", key: "ingles", url: "https://drive.google.com/file/d/1esjU9r4lGHm2W9v5X5GGq8XGGXL4uHyo/view?usp=drive_link" },
          { name: "Espanhol", key: "espanhol", url: "https://drive.google.com/file/d/1bqjqC5pkwgjSbDsfjdYDiF3j_8F8jVp7/view?usp=drive_link" }
        ]
      },
      {
        label: "5º ano",
        languages: [
          { name: "Inglês", key: "ingles", url: "https://drive.google.com/file/d/16aPVgE4zCZadlRfAhF8yTWsiBDvAowqH/view?usp=drive_link" },
          { name: "Espanhol", key: "espanhol", url: "https://drive.google.com/file/d/1yAfUC3cxmcJ2ZzBvjAJMfG7o4NyqXmVT/view?usp=drive_link" }
        ]
      }
    ]
  }
];
