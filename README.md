# app-gastos

Aplicativo pessoal de controle de gastos, desenvolvido como PWA para uso no iPhone.

## Objetivo
Registrar receitas e despesas em poucos segundos, acompanhar gastos por categoria e visualizar resumos e gráficos mensais.

## Tecnologias planejadas
- React + TypeScript
- PWA instalável no iPhone
- Dexie.js / IndexedDB para armazenamento local (offline-first)
- Google Drive para backups versionados, com autenticação OAuth
- Cloudflare Pages para hospedagem, respeitando os limites gratuitos

## Escopo inicial (MVP)
- Registro rápido de receitas e despesas (valor, categoria e data; descrição opcional)
- Categorias personalizáveis
- Histórico com pesquisa, filtros, edição e exclusão
- Resumo mensal e gráficos
- Exportação JSON/CSV e restauração
- Indicação do estado do backup

## Princípios
1. Salvar primeiro localmente; nunca bloquear um lançamento aguardando a nuvem.
2. Usar valores monetários como inteiros em centavos.
3. Proteger dados pessoais, sem armazenar tokens ou segredos no repositório.
4. Implementar e testar uma etapa por vez.
5. Manter o projeto dentro das cotas gratuitas dos serviços adotados.

## Etapas
- [x] Criar repositório GitHub e registrar a especificação inicial
- [ ] Criar projeto React + TypeScript com Vite
- [ ] Montar interface e navegação mobile
- [ ] Implementar persistência local e operações de lançamentos/categorias
- [ ] Implementar histórico, resumos e gráficos
- [ ] Integrar backup Google Drive e restauração
- [ ] Configurar PWA, publicação e testes reais no iPhone

## Status
Planejamento inicial. Ainda não há aplicativo executável.
