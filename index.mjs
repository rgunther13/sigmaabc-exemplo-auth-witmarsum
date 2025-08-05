import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.get('/', (req, res) => {
  
  // Acessa os parâmetros da URL
  const { matricula, nome, cpf, cnpj, tipo } = req.query;

  // Lógica para obter a senha de forma segura (não hardcoded)
  const senha_da_cooperativa = 'N0FFCJSN4V75JH6SUT05587G7JGMYHEUAUPDW66E19F47A23FWNYPFGTFPXZU3QL'; 

  const TIPO_USUARIO = Object.freeze({
      COOPERADO: 'cooperado',
      COLABORADOR: 'colaborador'
  });

  if(!senha_da_cooperativa) {
    console.error(`Senha da cooperativa não informada.`);
    return res.status(400).send(`Senha da cooperativa não informada.`);
  }
  
  // Verificação dos parâmetros recebidos
  if(!matricula || !nome || !cpf || !tipo) {
    return res.status(400).send(`Parâmetros de usuário faltando.`);
  }

  const token = jwt.sign(
    {
      matricula,
      nome,
      cpf,
      cnpj
    },
    senha_da_cooperativa
  );

  if(tipo === TIPO_USUARIO.COOPERADO) {
    console.log(`URL acessada pelo COOPERADO: ${nome} - matrícula: ${matricula}`);
    return res.redirect(`https://api.sigmaabc.org/login/token/witmarsum/cooperado?token=${token}`);
  } else if(tipo === TIPO_USUARIO.COLABORADOR) {
    console.log(`URL acessada pelo COLABORADOR: ${nome} - matrícula: ${matricula}`);
    return res.redirect(`https://api.sigmaabc.org/login/token/witmarsum/colaborador?token=${token}`);
  } else {
    console.error(`Tipo de usuário inválido: ${tipo}`);
    return res.status(400).send(`Tipo de usuário inválido. O tipo deve ser cooperado ou colaborador.`);
  }

});

app.listen(3000, () =>
  console.log('Aplicação rodando na porta 3000!'),
);