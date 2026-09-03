export interface FontOption {
  id: string;
  name: string;
  className: string;
  sample: string;
  category: 'Serif' | 'Sans-serif' | 'Handwriting' | 'Display';
}

export const AVAILABLE_FONTS: FontOption[] = [
  { id: 'font-aclonica', name: 'Aclonica', className: 'font-aclonica', sample: 'Aa', category: 'Display' },
  { id: 'font-acme', name: 'Acme', className: 'font-acme', sample: 'Aa', category: 'Sans-serif' },
  { id: 'font-amatic', name: 'Amatic SC', className: 'font-amatic', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-architects', name: 'Architects Daughter', className: 'font-architects', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-bebas', name: 'Bebas Neue', className: 'font-bebas', sample: 'Aa', category: 'Display' },
  { id: 'font-bellota', name: 'Bellota', className: 'font-bellota', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-caveat', name: 'Caveat', className: 'font-caveat', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-caveat-brush', name: 'Caveat Brush', className: 'font-caveat-brush', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-charmonman', name: 'Charmonman', className: 'font-charmonman', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-cinzel', name: 'Cinzel', className: 'font-cinzel', sample: 'AA', category: 'Serif' },
  { id: 'font-cookie', name: 'Cookie', className: 'font-cookie', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-courgette', name: 'Courgette', className: 'font-courgette', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-crimson', name: 'Crimson Text', className: 'font-crimson', sample: 'Aa', category: 'Serif' },
  { id: 'font-delius', name: 'Delius', className: 'font-delius', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-exo', name: 'Exo', className: 'font-exo', sample: 'Aa', category: 'Sans-serif' },
  { id: 'font-fredericka', name: 'Fredericka the Great', className: 'font-fredericka', sample: 'Aa', category: 'Display' },
  { id: 'font-gorditas', name: 'Gorditas', className: 'font-gorditas', sample: 'Aa', category: 'Display' },
  { id: 'font-handlee', name: 'Handlee', className: 'font-handlee', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-henny', name: 'Henny Penny', className: 'font-henny', sample: 'Aa', category: 'Display' },
  { id: 'font-homemade', name: 'Homemade Apple', className: 'font-homemade', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-lobster', name: 'Lobster', className: 'font-lobster', sample: 'Aa', category: 'Display' },
  { id: 'font-mansalva', name: 'Mansalva', className: 'font-mansalva', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-pacifico', name: 'Pacifico', className: 'font-pacifico', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-playfair', name: 'Playfair Display', className: 'font-playfair', sample: 'Aa', category: 'Serif' },
  { id: 'font-script', name: 'Dancing Script', className: 'font-script', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-garamond', name: 'Cormorant Garamond', className: 'font-garamond', sample: 'AA', category: 'Serif' },
  { id: 'font-great-vibes', name: 'Great Vibes', className: 'font-great-vibes', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-italiana', name: 'Italiana', className: 'font-italiana', sample: 'Aa', category: 'Serif' },
  { id: 'font-kalam', name: 'Kalam', className: 'font-kalam', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-marcellus', name: 'Marcellus', className: 'font-marcellus', sample: 'Aa', category: 'Serif' },
  { id: 'font-quicksand', name: 'Quicksand', className: 'font-quicksand', sample: 'Aa', category: 'Sans-serif' },
  { id: 'font-sacramento', name: 'Sacramento', className: 'font-sacramento', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-sans-modern', name: 'Modern Sans (Jakarta)', className: 'font-sans-modern', sample: 'Aa', category: 'Sans-serif' },
  { id: 'font-satisfy', name: 'Satisfy', className: 'font-satisfy', sample: 'Aa', category: 'Handwriting' },
  { id: 'font-shadows', name: 'Shadows Into Light', className: 'font-shadows', sample: 'Aa', category: 'Handwriting' },
];
