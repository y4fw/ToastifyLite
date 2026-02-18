# 🍞 toastify-lite

Uma lib de toast minimalista, sem dependências, com estilo próprio.

---

## Instalação

Só jogar o `toast.js` no seu projeto e importar:

```js
import toast from './toast.js'
```

---

## Uso básico

```js
toast('Mensagem simples')

toast.success('Salvo com sucesso!')
toast.error('Algo deu errado.')
toast.warning('Atenção aqui.')
toast.info('FYI: isso aqui é uma info.')
```

---

## Com título

```js
toast.success('Arquivo enviado com sucesso.', {
  title: 'Upload concluído'
})
```

---

## Toast customizado

Usa `toast.custom()` pra estilizar do zero:

```js
toast.custom({
  message: 'Você ganhou 500 XP!',
  title: 'Level up!',
  background: '#0f0f1a',
  border: '1px solid #a855f7',
  icon: '⚡',
  iconColor: '#a855f7',
  duration: 5000
})
```

### Opções disponíveis

| Opção | Tipo | Descrição |
|---|---|---|
| `message` | `string` | Texto do toast (obrigatório) |
| `title` | `string` | Título em destaque acima da mensagem |
| `duration` | `number` | Duração em ms (padrão: `4000`, `0` = não some) |
| `position` | `string` | Posição na tela (sobrescreve o padrão) |
| `background` | `string` | Cor de fundo |
| `border` | `string` | Borda CSS completa (ex: `'1px solid red'`) |
| `icon` | `string` | Ícone dentro do círculo (emoji ou texto) |
| `iconColor` | `string` | Cor do ícone e da barra de progresso |
| `style` | `object` | Qualquer estilo CSS extra via objeto |

---

## Posições

```js
import toast, { Positions } from './toast.js'

toast.setPosition(Positions.topCenter)
```

As posições disponíveis são:

```
top-left      top-center      top-right
bottom-left   bottom-center   bottom-right
```

Você também pode passar a posição direto no toast, sem mudar o padrão:

```js
toast.error('Ops!', { position: 'top-right' })
```

---

## Exemplo completo

```js
import toast, { Positions } from './toast.js'

toast.setPosition(Positions.bottomRight)

toast.success('Perfil atualizado!')

toast.custom({
  title: 'Nova mensagem',
  message: 'Você recebeu uma resposta.',
  icon: '💬',
  iconColor: '#38bdf8',
  border: '1px solid #38bdf8',
  duration: 6000
})
```

---

## Comportamento padrão

- Clicar no toast fecha ele
- O botão `✕` fecha sem propagar o clique
- A barra de progresso embaixo mostra o tempo restante
- Toasts se empilham sem sobrescrever

---

## Licença

MIT
