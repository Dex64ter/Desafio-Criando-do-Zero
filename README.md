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

## Home

```typescript
// ./pages/index.tsx
// Home()

// ...
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts',
  {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.main', 'posts.content' ],
    pageSize: 4,
  });
  
  const posts = postsResponse.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      },
    };
  })


  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts
      }
    },
    revalidate: 60 * 5 // 30 min
  }
};

```
 Para a página principal da aplicação, temos um novo tipo de dado para ser utilizado que recebemos do prismic, o *next_page* o qual é uma propriedade que aparece na função *getByType()* do prismic/client da nova versão e que nos retorna um link para a próxima página de dados. Fazemos todo o recebimento de dados dentro da função getStaticProps() já que todo o conteúdo dessa página será estático, apenas mostrando os artigos a serem lidos.

```json
// Como serão exibidos os dados dentro da aplicação
{
  "next_page": "https://dex64ter-criando-projeto-do-zero.cdn.prismic.io/api/v2/documents/search?ref=ZVO-FxIAACMAp9YH&q=%5B%5Bat%28document.type%2C+%22posts%22%29%5D%5D&page=2&pageSize=4&fetch=posts.title%2Cposts.subtitle%2Cposts.author%2Cposts.main%2Cposts.content",    
  "results": [
    {
      "uid": "como-criar-seu-primeiro-mern",
      "first_publication_date": "2023-11-14T17:41:49+0000",
      "data": {
        "title": "Como criar seu primeiro MERN (MongoDB, ExpressJs, React, Node)",        
        "subtitle": "Utilizando todas as tecnologias citadas faremos aplicações funcionais.",
        "author": "Sam Barros"
      }
    },
  ]
}
```

 Quando recebemos os dados de todos os posts na função assíncrona "getByType" podemos configurar a exibição de items por página na segunda posição da chamada de função com a propriedade **pageSize**.

 Quando a quantidade de items por página ultrapassa o valor dessa propriedade, o valor da propriedade **next_page** é criado como um link para a "próxima página" com o resto dos items que serão mostrados.

 Com essa lógica, podemos usar o **fecth** para buscar os dados da "próxima página", passando o link do **next_page** como parâmetro: 

 ```typescript
 // ./pages/index.tsx
 // ...
 export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  return (
    // ... mais código
          {
            nextPage && (
              <button
                type="button"
                className={styles.loadMore}
                onClick={async () => {
                  const response = await fetch(nextPage);
                  const data = await response.json();

                  setNextPage(data.next_page);

                  const newPosts = data.results.map(post => {
                    return {
                      uid: post.uid,
                      first_publication_date: post.first_publication_date,
                      data: {
                        title: post.data.title,
                        subtitle: post.data.subtitle,
                      }
                    }
                  })

                  setPosts([...posts, ...newPosts]);
                }}
              >
                Carregar mais posts
              </button>
            )
          }
    // ... mais código
}
```

Todo o resto da página usamos formatação adequada e estilização presente no arquivo *./home.module.scss* junto com a biblioteca date-fns e a react-icons.

## Post

Como já sabemos, podemos personalizar a rota da página especifica para o item clicado pelo usuário. Ao clicar em um item na página *Home* ele será levado para a rota de acordo com o endereço presente na estrutura **Link** do **next** presente dentro da página.

```typescript
// ./pages/index.tsx
// Home()
<Link key={post.uid} href={`/posts/${post.uid}`}>
// ...código
</Link>
```

  O post.uid é a propriedade que é fornecida pelo Prismic que difere cada postagem. Dessa forma, podemos enviar o usuário para a página esperada de acordo com o conteúdo do post que possui esse código uid no Prismic.

  Para que isso seja possível, dentro da rota "/posts" adicionamos o arquivo ```[slug].tsx``` esse item entre "[ ]" significa que será esperado um item apenas no lugar de _"slug"_ dessa forma, quando entrar na rota do post clicado pelo usuário, o **post.uid** do ficará no lugar de _"slug"_.

  ```localhost:3000/posts/[nome-do-post-aqui]```

Como a página de cada post também será estática, aqui também utilizaremos a função *getStaticProps()* só que com a seguinte formatação dos dados:

```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('posts', slug.toString());

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.main.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body.map(bd => {
            return {
              text: bd.text,
            }
          })
        }
      })
    }
  }

  return {
    props: {
      post,
    }
  }
};
```

---
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

