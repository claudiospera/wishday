export const INVITE_TEMPLATES = {
  botanico: {
    name: 'Botanico Lusso',
    font: 'Cormorant Garamond',
    italic: true,
    palettes: [
      { name: 'Verde Foresta', bg: 'linear-gradient(160deg,#1a2e1a,#2d4a2d)', tag: '#a8d4a8', nameColor: '#f0ede6', event: '#c8e6c8', sep: '#6a9e6a', date: '#d4c9b0', venue: '#8ab88a' },
      { name: 'Bordeaux', bg: 'linear-gradient(160deg,#2e1a1a,#4a2d2d)', tag: '#e8b4b4', nameColor: '#f5ede6', event: '#e8c8c8', sep: '#9e6a6a', date: '#d4c4b0', venue: '#c48a8a' },
      { name: 'Navy', bg: 'linear-gradient(160deg,#0d1b2a,#1a2d4a)', tag: '#a8c4e8', nameColor: '#f0ede6', event: '#c8dae8', sep: '#6a8a9e', date: '#b0c4d4', venue: '#8aaac8' },
      { name: 'Viola Notte', bg: 'linear-gradient(160deg,#1e1a2e,#2e2a4a)', tag: '#c4b4e8', nameColor: '#f0ede6', event: '#d0c8e8', sep: '#8a7aaa', date: '#c4b8d4', venue: '#aa96c8' },
      { name: 'Petrolio', bg: 'linear-gradient(160deg,#0a1e1e,#122e2e)', tag: '#98d4cc', nameColor: '#e8f5f4', event: '#b8e0dc', sep: '#50968e', date: '#c0d8d4', venue: '#7ab8b0' },
      { name: 'Cioccolato', bg: 'linear-gradient(160deg,#1e140a,#2e200e)', tag: '#d4b88a', nameColor: '#f5ede0', event: '#d4c4a0', sep: '#8a6a3a', date: '#c8b490', venue: '#a88a60' },
    ]
  },
  sabbia: {
    name: 'Minimalista Sand',
    font: 'Playfair Display',
    italic: false,
    palettes: [
      { name: 'Sand Caldo', bg: '#f5f0e8', tag: '#a0917a', nameColor: '#2c2317', event: '#7a6a55', sep: '#c9a96e', date: '#5a4a35', venue: '#9a8a72' },
      { name: 'Lino Grigio', bg: '#f0ede8', tag: '#8a8070', nameColor: '#1c1a18', event: '#6a6058', sep: '#a09078', date: '#3a3028', venue: '#7a7068' },
      { name: 'Rosa Antico', bg: '#f5ede8', tag: '#a07870', nameColor: '#2a1510', event: '#7a5550', sep: '#c98878', date: '#5a3530', venue: '#aa7870' },
      { name: 'Salvia', bg: '#edf0e8', tag: '#6a7a5a', nameColor: '#1a2010', event: '#5a6a4a', sep: '#7a9a6a', date: '#3a4a28', venue: '#6a7a58' },
      { name: 'Cipria', bg: '#f5ece8', tag: '#907060', nameColor: '#281008', event: '#786050', sep: '#c09080', date: '#503828', venue: '#907868' },
      { name: 'Azzurro Polvere', bg: '#eaeff5', tag: '#607888', nameColor: '#101820', event: '#506070', sep: '#7898b0', date: '#304050', venue: '#607080' },
    ]
  },
  nero: {
    name: 'Couture Nero',
    font: 'Playfair Display',
    italic: false,
    palettes: [
      { name: 'Oro Classico', bg: '#0c0c0c', tag: '#888888', nameColor: '#f5f0e8', event: '#555555', sep: '#c9a96e', date: '#c9a96e', venue: '#555555' },
      { name: 'Argento', bg: '#0c0c0c', tag: '#777777', nameColor: '#f0f0f0', event: '#555555', sep: '#aaaaaa', date: '#aaaaaa', venue: '#4a4a4a' },
      { name: 'Rose Gold', bg: '#0c0c0c', tag: '#886060', nameColor: '#f5ede8', event: '#664848', sep: '#c98878', date: '#c98878', venue: '#553838' },
      { name: 'Teal Freddo', bg: '#060e10', tag: '#607a80', nameColor: '#e8f5f5', event: '#406a70', sep: '#50a0a8', date: '#78c0c8', venue: '#305860' },
      { name: 'Platino', bg: '#111111', tag: '#909090', nameColor: '#efefef', event: '#606060', sep: '#c8c8c8', date: '#d8d8d8', venue: '#505050' },
      { name: 'Ametista', bg: '#0e0a18', tag: '#9070c0', nameColor: '#ede0f5', event: '#7050a0', sep: '#a070d8', date: '#c090e8', venue: '#705090' },
    ]
  },
  matrimonio: {
    name: 'Ivory Elegance',
    font: 'Cormorant Garamond',
    italic: true,
    palettes: [
      { name: 'Ivory', bg: 'linear-gradient(170deg,#fefdf8,#f8f4e8)', tag: '#8d6e47', nameColor: '#3e2723', event: '#8d6e47', sep: '#c9a96e', date: '#6d4c41', venue: '#a08060' },
      { name: 'Blush Rosa', bg: 'linear-gradient(170deg,#fef5f5,#fce8e8)', tag: '#a05060', nameColor: '#3e1520', event: '#a05060', sep: '#d48898', date: '#804048', venue: '#b07888' },
      { name: 'Cielo', bg: 'linear-gradient(170deg,#f5f8fe,#e8eef8)', tag: '#507090', nameColor: '#102030', event: '#507090', sep: '#88aac8', date: '#305070', venue: '#7090b0' },
      { name: 'Salvia Verde', bg: 'linear-gradient(170deg,#f5f8f2,#e8f0e4)', tag: '#507040', nameColor: '#102010', event: '#507040', sep: '#88a870', date: '#305020', venue: '#70906a' },
      { name: 'Lavanda', bg: 'linear-gradient(170deg,#f8f5fe,#ede8f8)', tag: '#705090', nameColor: '#200838', event: '#705090', sep: '#a888d0', date: '#502870', venue: '#906ab0' },
      { name: 'Champagne', bg: 'linear-gradient(170deg,#fdfaf0,#f5eedc)', tag: '#907848', nameColor: '#302008', event: '#907848', sep: '#c8a860', date: '#604828', venue: '#b09060' },
    ]
  },
  bimbi: {
    name: 'Arcobaleno Kids',
    font: 'Nunito',
    italic: false,
    palettes: [
      { name: 'Arcobaleno', bg: 'linear-gradient(145deg,#fffde7,#f0f4ff)', tag: '#7b1fa2', nameColor: '#e91e63', event: '#7b1fa2', sep: '#ff9800', date: '#1565c0', venue: '#6a1b9a' },
      { name: 'Oceano', bg: 'linear-gradient(145deg,#e0f7fa,#e8f5fe)', tag: '#006064', nameColor: '#0d47a1', event: '#006064', sep: '#26c6da', date: '#0d47a1', venue: '#00838f' },
      { name: 'Giungla', bg: 'linear-gradient(145deg,#f1f8e9,#e8f5e9)', tag: '#1b5e20', nameColor: '#1b5e20', event: '#2e7d32', sep: '#66bb6a', date: '#1b5e20', venue: '#388e3c' },
      { name: 'Tramonto', bg: 'linear-gradient(145deg,#fff8e1,#fce4ec)', tag: '#e65100', nameColor: '#880e4f', event: '#e65100', sep: '#ff7043', date: '#bf360c', venue: '#c62828' },
      { name: 'Caramella', bg: 'linear-gradient(145deg,#fce4ec,#f8bbd0)', tag: '#880e4f', nameColor: '#880e4f', event: '#ad1457', sep: '#f06292', date: '#6a1b9a', venue: '#c2185b' },
      { name: 'Dinosauri', bg: 'linear-gradient(145deg,#e8f5e9,#fff9c4)', tag: '#2e7d32', nameColor: '#1b5e20', event: '#388e3c', sep: '#aed581', date: '#33691e', venue: '#558b2f' },
    ]
  },
  spazio: {
    name: 'Spazio Cosmico',
    font: 'Nunito',
    italic: false,
    palettes: [
      { name: 'Cosmo Viola', bg: 'linear-gradient(180deg,#0d0d2b,#2d1b4e)', tag: '#80deea', nameColor: '#ffffff', event: '#80cbc4', sep: '#4dd0e1', date: '#e0f7fa', venue: '#80cbc4' },
      { name: 'Galassia Blu', bg: 'linear-gradient(180deg,#050a1a,#0d1b3e)', tag: '#82b1ff', nameColor: '#e8eeff', event: '#5c8aff', sep: '#448aff', date: '#bbdefb', venue: '#7986cb' },
      { name: 'Nebulosa Rosa', bg: 'linear-gradient(180deg,#1a0a1e,#2e0a3a)', tag: '#f48fb1', nameColor: '#fce4ec', event: '#f06292', sep: '#ec407a', date: '#f8bbd0', venue: '#ce93d8' },
      { name: 'Marte Rosso', bg: 'linear-gradient(180deg,#1a0800,#3e1000)', tag: '#ff8a65', nameColor: '#fbe9e7', event: '#ff7043', sep: '#f4511e', date: '#ffccbc', venue: '#ff7043' },
      { name: 'Aurora Verde', bg: 'linear-gradient(180deg,#001a10,#003820)', tag: '#a5d6a7', nameColor: '#e8f5e9', event: '#66bb6a', sep: '#43a047', date: '#c8e6c9', venue: '#81c784' },
      { name: 'Saturno Oro', bg: 'linear-gradient(180deg,#0e0800,#1e1400)', tag: '#ffd54f', nameColor: '#fff8e1', event: '#ffb300', sep: '#ffc107', date: '#ffecb3', venue: '#ffa000' },
    ]
  },
  laurea: {
    name: 'Laurea',
    font: 'Cormorant Garamond',
    italic: true,
    palettes: [
      { name: 'Azzurro Accademico', bg: 'linear-gradient(160deg,#1a2e4a,#0d1e3a)', tag: '#88aadd', nameColor: '#f0f4ff', event: '#aaccee', sep: '#6688cc', date: '#c8d8f0', venue: '#7799cc' },
      { name: 'Oro', bg: 'linear-gradient(160deg,#1e1600,#2e2200)', tag: '#d4aa44', nameColor: '#fff8e0', event: '#c49a30', sep: '#b8920a', date: '#f0d888', venue: '#b08820' },
      { name: 'Bordeaux', bg: 'linear-gradient(160deg,#2e0a0a,#480e0e)', tag: '#e8a0a0', nameColor: '#fff0f0', event: '#d08080', sep: '#c06060', date: '#f0c0c0', venue: '#c07070' },
      { name: 'Navy', bg: 'linear-gradient(160deg,#0a0e2e,#0e1848)', tag: '#9ab0ee', nameColor: '#e8eeff', event: '#7890dd', sep: '#5068bb', date: '#c0ccf0', venue: '#7088cc' },
      { name: 'Verde', bg: 'linear-gradient(160deg,#0a2010,#102a18)', tag: '#80c898', nameColor: '#e8f5ec', event: '#60a878', sep: '#409858', date: '#b0dcc0', venue: '#508860' },
      { name: 'Grigio', bg: 'linear-gradient(160deg,#1a1a1a,#2a2a2a)', tag: '#aaaaaa', nameColor: '#f0f0f0', event: '#888888', sep: '#777777', date: '#cccccc', venue: '#999999' },
    ]
  },
  battesimo: {
    name: 'Battesimo',
    font: 'Dancing Script',
    italic: false,
    palettes: [
      { name: 'Celeste', bg: 'linear-gradient(170deg,#e8f6ff,#d0ecff)', tag: '#4488bb', nameColor: '#0a2a44', event: '#3378aa', sep: '#66aad4', date: '#1a5080', venue: '#5590bb' },
      { name: 'Lavanda', bg: 'linear-gradient(170deg,#f0eaff,#e4d8ff)', tag: '#8866cc', nameColor: '#2a0a4a', event: '#7755bb', sep: '#aa88e8', date: '#441880', venue: '#9977cc' },
      { name: 'Rosa', bg: 'linear-gradient(170deg,#fff0f5,#ffe0ee)', tag: '#cc6688', nameColor: '#3a0820', event: '#bb5577', sep: '#ee88aa', date: '#660030', venue: '#dd7799' },
      { name: 'Azzurro Cielo', bg: 'linear-gradient(170deg,#dff0ff,#c8e4ff)', tag: '#3366aa', nameColor: '#081830', event: '#2255aa', sep: '#5588cc', date: '#0a3060', venue: '#4477bb' },
      { name: 'Bianco', bg: 'linear-gradient(170deg,#ffffff,#f5f5f5)', tag: '#888888', nameColor: '#222222', event: '#555555', sep: '#aaaaaa', date: '#333333', venue: '#777777' },
      { name: 'Champagne', bg: 'linear-gradient(170deg,#fdf8f0,#f5eedc)', tag: '#9a7848', nameColor: '#302008', event: '#907848', sep: '#c8a860', date: '#604828', venue: '#b09060' },
    ]
  },
  generico: {
    name: 'Generico',
    font: 'Plus Jakarta Sans',
    italic: false,
    palettes: [
      { name: 'Notte Festiva', bg: 'linear-gradient(160deg,#0a0a1a,#1a1030)', tag: '#cc99ff', nameColor: '#ffffff', event: '#aa77ee', sep: '#8844cc', date: '#ddbbff', venue: '#9966dd' },
      { name: 'Solare', bg: 'linear-gradient(160deg,#fff8c0,#ffe878)', tag: '#aa6600', nameColor: '#1a0a00', event: '#bb7700', sep: '#dd9900', date: '#4a2800', venue: '#cc8800' },
      { name: 'Teal', bg: 'linear-gradient(160deg,#003838,#005050)', tag: '#66cccc', nameColor: '#e0ffff', event: '#44aaaa', sep: '#33bbbb', date: '#aaeeff', venue: '#55bbbb' },
      { name: 'Corallo', bg: 'linear-gradient(160deg,#fff0ec,#ffe0d8)', tag: '#cc4422', nameColor: '#2a0a00', event: '#bb3311', sep: '#ee7755', date: '#660000', venue: '#dd6644' },
      { name: 'Verde', bg: 'linear-gradient(160deg,#e8fff0,#d0ffdc)', tag: '#226622', nameColor: '#001a00', event: '#114411', sep: '#44aa44', date: '#003300', venue: '#338833' },
      { name: 'Viola', bg: 'linear-gradient(160deg,#f5eeff,#eedcff)', tag: '#7722cc', nameColor: '#1a0030', event: '#6611bb', sep: '#9944ee', date: '#3a0060', venue: '#8833dd' },
    ]
  },
} as const

export type TemplateKey = keyof typeof INVITE_TEMPLATES
export type PaletteConfig = typeof INVITE_TEMPLATES[TemplateKey]['palettes'][number]
