# 💻 Desafio Criando do Zero

## Reactjs-criando-um-projeto-do-zero
  O projeto consiste em um blog de acesso a diversos artigos com o nome de Space Traveling. Utilizamos o que foi aprendido nas aulas de ReactJS, relacionado a parte do uso de Next.js e todos os conceitos vistos.
  
## Página principal
  Para alterarmos o percurso da aplicação, primeiro devemos alterar o arquivo *../src/_document.tsx* que representa a raiz do nosso projeto. Nele podemos estruturar nossa aplicação conforme desejarmos, nele podemos importar as fontes e estruturar de acordo com as estruturas presentes no Next que condificam uma página html.
```typescript
// importação dos elementos
import Document, { Html, Head, Main, NextScript } from 'next/document';
// ...
// estruturação dos elementos
export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/Vector.png" type="image/png" />
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}
//...
```

Obs: Caso queira utilizar imagens na aplicação, todas as imagens são salvas no caminho *./public/images* e para utilizar em qualquer lugar do projeto, podemos apenas digitar _/images/[nome do arquivo de imagem]_.

## Prismic CMS
  Para recebermos os dados dos posts, utilizamos uma JAMStack chamada Prismic CMS que nos fornece uma interface prática para manejamento desse tipo de conteúdo. Com ele podemos fazer toda a configuração dos posts via web e receber do cliente que ele nos fornece pelo arquivo ___../src/services/prismic.ts___ os dados dos posts da aplicação.
  O seguinte código se utiliza do que é fornecido na documentação do prismic para criação de um cliente para ter acesso a determinado projeto do dashboard do prismic.

```typescript
import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

export interface PrismicConfig {
  req?: HttpRequestLike;
}

export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const client = prismic.createClient(process.env.PRISMIC_API_ENDPOINT);

  enableAutoPreviews({
    client,
    req: config.req,
  });

  return client;
}
```
  A informação mais importante é a variável ambiente "PRISMIC_API_ENDPOINT" que se encontra nas configurações do projeto criado no prismic CMS.
  Na página Home, usamos o getStaticProps para receber os dados do prismic, agora com a função _getByType()_, e formatamos conforme as interfaces já criadas de acordo com o tipo de cada propriedade.

## Estilizações
## 📝 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  <img alt="Rocketseat Education" src="https://avatars.githubusercontent.com/u/69590972?s=200&v=4" width="100px" />
</p>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Rocketseat&message=Education&color=8257e5&labelColor=202024" alt="Rocketseat Project" />
  <a href="LICENSE"><img  src="https://img.shields.io/static/v1?label=License&message=MIT&color=8257e5&labelColor=202024" alt="License"></a>
</p>

---

<p align="center">
  Feito com 💜 by Rocketseat
</p>


<!--START_SECTION:footer-->

<br />
<br />

<p align="center">
  <a href="https://discord.gg/rocketseat" target="_blank">
    <img align="center" src="https://storage.googleapis.com/golden-wind/comunidade/rodape.svg" alt="banner"/>
  </a>
</p>

<!--END_SECTION:footer-->

