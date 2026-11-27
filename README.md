# Tequilife · Demo de rediseño

Propuesta de rediseño para [tequilife.com.mx](https://www.tequilife.com.mx/): una página principal y una página 404, hechas con HTML, CSS y JavaScript sin frameworks.

La demo conserva la identidad de la marca (logo, fotos y colores) y resuelve los problemas del sitio actual:

- No hay un icono de carrito visible.
- El menú está metido en una caja flotante que se mueve con la página.
- La ventana de mayoría de edad se corta en celular.
- Los productos de la tienda no están organizados.
- Hay textos en inglés y faltas de ortografía.

## Dónde verla

Publicada en <https://tequilife.pinuindustries.com/?demo> con GitHub Pages, desde la rama `main`. No aparece en buscadores.

### En local

Desde la raíz del proyecto:

```bash
python3 -m http.server 8765
```

Luego abre <http://127.0.0.1:8765>.

Usa un servidor local en lugar de abrir el archivo con doble clic: el logo se dibuja con `mask-image` y el navegador lo bloquea con `file://`.

### Enlaces útiles

| Enlace | Qué hace |
|---|---|
| `/?demo` | Omite la ventana de mayoría de edad. Útil para presentar. |
| `/?color=rosa` · `azul` · `anejo` | Abre la portada con ese tequila ya seleccionado. |
| `/#carrito` | Abre el carrito al cargar. |
| `/404.html` | Página de error. |

Los enlaces se pueden combinar, por ejemplo `/?demo&color=azul`.

## Qué incluye

### Página principal (`index.html`)

- **Portada "Elige tu color".** Al elegir Rosa, Azul o Añejo cambian el color de toda la sección, la foto y el producto. Se puede agregar al carrito desde ahí.
- **Menú fijo a todo lo ancho.** Se compacta al bajar y en celular se abre a pantalla completa.
- **Carrito siempre visible.** Tiene contador y un panel lateral con cantidades, total y envío incluido. Se guarda en `localStorage`.
- **Tienda con filtros:** Rosa, Azul, Añejo, Rosa & Azul, Minis y Packs de 12.
- **Promo de posadas.** La piñata de regalo se marca en los packs de 12.
- **Historia, cócteles y blog**, con los textos del sitio actual corregidos.
- **Newsletter** con validación y mensaje de confirmación.
- **Ventana de mayoría de edad** responsiva, que recuerda la respuesta.

### Página 404 (`404.html`)

"Esta página se quedó sin color": un 404 en contorno que se colorea al pasar el mouse, con accesos a inicio, tienda y a cada tequila.

## Estructura

```
├── index.html   Página principal
├── 404.html     Página de error
├── styles.css   Estilos de ambas páginas (la sección 404 está al final)
├── app.js       Lógica de la página principal
├── 404.js       Lógica de la 404
├── robots.txt   Bloquea la indexación en buscadores
└── assets/      Imágenes en WebP
```

Los archivos están en la raíz del repositorio para que GitHub Pages pueda publicarlos directamente desde la rama `main`.

## Sistema visual

| Rol | Color |
|---|---|
| Verde azulado (base) | `#123A3F` |
| Lima (fondo) | `#EFFAB6` |
| Rosa | `#F4B3C9` / tinta `#4A0B26` |
| Azul | `#86D8E1` / tinta `#053A42` |
| Añejo | `#F1BC66` / tinta `#401D06` |

- **Tipografía:** [Unbounded](https://fonts.google.com/specimen/Unbounded) para títulos y [Onest](https://fonts.google.com/specimen/Onest) para textos, ambas de Google Fonts.
- **Iconos:** SVG propios con el trazo de la librería Lucide.
- **Detalle de marca:** el borde de timbre postal de las etiquetas se repite en los precios.

Todos los colores están como variables CSS al inicio de `styles.css`.

## Pendiente de confirmar con el cliente

- [ ] **Horario de atención.** La demo dice 9:00 a 18:00; el sitio actual dice "9AM a 6AM".
- [ ] **Alcance de la promo de posadas.** Solo está marcada en los Doce Packs; falta saber si también aplica a los 12 minis.
- [ ] **Enlaces reales** de redes sociales, artículos del blog, cuenta, avisos legales y pago. Por ahora apuntan a `#`.
- [ ] **Pasarela de pago.** El botón "Pagar" solo muestra un aviso de demo.

## Notas

- Las imágenes y los textos son propiedad de TEQUILIFE. Se tomaron del sitio actual solo para presentar esta propuesta.
- Los precios son los publicados en el sitio actual.
- La demo está preparada para publicarse como propuesta: no se indexa en buscadores (`noindex` y `robots.txt`), muestra una franja de "Propuesta de diseño por Pinu Industries" y el newsletter aclara que no envía datos. Si el cliente aprueba el proyecto, hay que quitar esas tres cosas antes de lanzar el sitio real.
- El diseño siguió las guías de la skill [Impeccable](https://github.com/pbakaus/impeccable). Se usaron solo sus documentos; no se instaló el plugin ni se ejecutó su programa.
- Se revisó con el linter de la skill [Hallmark](https://github.com/Nutlope/hallmark) (`sloplint`) sin instalarla. Se corrigieron los hallazgos de accesibilidad y layout; los de estilo propios de Hallmark se descartaron a propósito.
