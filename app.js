(() => {
  const PAGE_SIZE = 24;
  const state = { category: "All", subCategory: "All", search: "", sort: "featured", limit: PAGE_SIZE };
  const grid = document.querySelector("#product-grid"), filterWrap = document.querySelector("#category-filters");
  const count = document.querySelector("#result-count"), search = document.querySelector("#search");
  const sort = document.querySelector("#sort"), subCategory = document.querySelector("#sub-category");
  const more = document.querySelector("#load-more"), money = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" });
  const fallback = category => {
    const label = String(category || "Catalog").replace(/[<>&]/g, "");
    return "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 700"><rect width="800" height="700" fill="#e9e3d7"/><path d="M370 130h60v90l80 80v255H290V300l80-80z" fill="#29413e"/><path d="M330 325h140v150H330z" fill="#f3eee4"/><text x="400" y="405" text-anchor="middle" font-family="Arial" font-weight="700" font-size="31" fill="#29413e">${label}</text></svg>`);
  };
  const groups = () => ["All", ...new Set(PRODUCTS.map(p => p.category).filter(Boolean).sort())];
  const types = () => [...new Set(PRODUCTS.filter(p => state.category === "All" || p.category === state.category).map(p => p.subCategory).filter(Boolean).sort())];
  function getList() {
    const query = state.search.trim().toLowerCase();
    return PRODUCTS.filter(p => (state.category === "All" || p.category === state.category) &&
      (state.subCategory === "All" || p.subCategory === state.subCategory) &&
      (!query || [p.name,p.category,p.subCategory,p.size,p.upc].join(" ").toLowerCase().includes(query)))
      .sort((a,b) => state.sort === "name-asc" ? a.name.localeCompare(b.name) : state.sort === "name-desc" ? b.name.localeCompare(a.name) : state.sort === "price-asc" ? a.price-b.price : state.sort === "price-desc" ? b.price-a.price : state.sort === "proof-desc" ? (b.proof||0)-(a.proof||0) : a.featured-b.featured);
  }
  function renderFilters() {
    filterWrap.replaceChildren(...groups().map(category => {
      const btn = document.createElement("button"); btn.className="filter"; btn.type="button"; btn.textContent=category;
      btn.setAttribute("aria-pressed", String(category === state.category));
      btn.onclick=()=>{ state.category=category; state.subCategory="All"; state.limit=PAGE_SIZE; render(); }; return btn;
    }));
    subCategory.replaceChildren(...["All", ...types()].map(type => { const option=document.createElement("option"); option.value=type; option.textContent=type === "All" ? "All types" : type; option.selected=type===state.subCategory; return option; }));
  }
  function productImage(product, image) {
    const gtin = String(product.upc || "").match(/\d{8,14}/)?.[0];
    image.src = fallback(product.category); image.alt = product.name;
    if (!gtin || /^0+$/.test(gtin)) return;
    const cacheKey = `catalog-image-${gtin}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { if (cached !== "none") image.src=cached; return; }
    fetch(`https://world.openfoodfacts.org/api/v2/product/${gtin}.json?fields=image_front_url`)
      .then(r=>r.ok?r.json():null).then(data => {
        const url=data?.product?.image_front_url; localStorage.setItem(cacheKey, url || "none"); if(url) image.src=url;
      }).catch(()=>localStorage.setItem(cacheKey,"none"));
  }
  function render() {
    const list=getList(), shown=list.slice(0,state.limit); renderFilters();
    count.textContent = `${list.length.toLocaleString()} in-stock ${list.length===1?"item":"items"}${shown.length<list.length ? ` · showing ${shown.length}` : ""}`;
    grid.replaceChildren();
    if (!list.length) { const empty=document.querySelector("#empty-template").content.cloneNode(true); empty.querySelector("button").onclick=()=>{state.category="All";state.subCategory="All";state.search="";search.value="";state.limit=PAGE_SIZE;render();};grid.append(empty);more.hidden=true;return; }
    const template=document.querySelector("#product-template");
    shown.forEach(product => { const card=template.content.cloneNode(true), img=card.querySelector("img"); productImage(product,img); img.onerror=()=>{img.onerror=null;img.src=fallback(product.category);}; card.querySelector(".category").textContent=`${product.category} · ${product.subCategory||"Other"}`;card.querySelector(".name").textContent=product.name;card.querySelector(".details").textContent=[product.size,product.proof?`${product.proof} proof`:""].filter(Boolean).join(" · ");card.querySelector(".price").textContent=money.format(product.price);grid.append(card); });
    more.hidden=shown.length>=list.length; more.textContent=`Show ${Math.min(PAGE_SIZE,list.length-shown.length)} more products`;
  }
  search.oninput=e=>{state.search=e.target.value;state.limit=PAGE_SIZE;render();}; sort.onchange=e=>{state.sort=e.target.value;render();}; subCategory.onchange=e=>{state.subCategory=e.target.value;state.limit=PAGE_SIZE;render();}; more.onclick=()=>{state.limit+=PAGE_SIZE;render();};render();
})();
