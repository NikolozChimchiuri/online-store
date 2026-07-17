const API_URL = "https://online-store-api.onrender.com/api";
let products = [
  {id:1,name:'უსადენო ყურსასმენი',category:'ტექნიკა',price:149,emoji:'🎧',tag:'ახალი'},
  {id:2,name:'არომატული სანთელი',category:'სახლისთვის',price:32,emoji:'🕯️',tag:'პოპულარული'},
  {id:3,name:'მზის სათვალე',category:'აქსესუარები',price:89,emoji:'🕶️',tag:''},
  {id:4,name:'სახის მოვლის ნაკრები',category:'სილამაზე',price:76,emoji:'🧴',tag:'−15%'},
  {id:5,name:'მაგიდის სანათი',category:'სახლისთვის',price:119,emoji:'💡',tag:''},
  {id:6,name:'ჭკვიანი საათი',category:'ტექნიკა',price:329,emoji:'⌚',tag:'ახალი'},
  {id:7,name:'ტილოს ჩანთა',category:'აქსესუარები',price:45,emoji:'👜',tag:''},
  {id:8,name:'თმის მოვლის სეტი',category:'სილამაზე',price:64,emoji:'🪮',tag:'რჩეული'}
];
let cart = JSON.parse(localStorage.getItem('marketly-cart') || '[]');
let category = 'ყველა';
const gel = n => `${n.toFixed(2)} ₾`;
const productArea = document.querySelector('#products');
function renderProducts(){const q=document.querySelector('#search').value.toLowerCase();const items=products.filter(p=>(category==='ყველა'||p.category===category)&&p.name.toLowerCase().includes(q));document.querySelector('#productCount').textContent=`${items.length} პროდუქტი`;productArea.innerHTML='';items.forEach(p=>{const el=document.querySelector('#productTemplate').content.cloneNode(true);el.querySelector('.tag').textContent=p.tag;el.querySelector('.tag').style.display=p.tag?'block':'none';el.querySelector('.product-emoji').textContent=p.emoji;el.querySelector('.product-category').textContent=p.category;el.querySelector('h3').textContent=p.name;el.querySelector('.price').textContent=gel(p.price);el.querySelector('.add').onclick=()=>add(p.id);el.querySelector('.wish').onclick=e=>e.currentTarget.classList.toggle('liked');productArea.append(el)})}
function add(id){const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});save();openCart()}
function save(){localStorage.setItem('marketly-cart',JSON.stringify(cart));renderCart()}
function renderCart(){const list=document.querySelector('#cartItems');const count=cart.reduce((s,x)=>s+x.qty,0);document.querySelector('#cartCount').textContent=count;list.innerHTML='';if(!cart.length)list.innerHTML='<p style="color:#6a756e;padding:20px 0">კალათა ჯერ ცარიელია.</p>';cart.forEach(item=>{const p=products.find(x=>x.id===item.id);const row=document.createElement('div');row.className='cart-item';row.innerHTML=`<div class="thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${item.qty} ც. × ${gel(p.price)}</small></div><div><b>${gel(p.price*item.qty)}</b><br><button class="remove">წაშლა</button></div>`;row.querySelector('.remove').onclick=()=>{cart=cart.filter(x=>x.id!==p.id);save()};list.append(row)});document.querySelector('#cartTotal').textContent=gel(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0))}
const panel=document.querySelector('#cartPanel'),overlay=document.querySelector('#overlay');function openCart(){panel.classList.add('open');overlay.classList.add('show');panel.setAttribute('aria-hidden','false')}function closeCart(){panel.classList.remove('open');overlay.classList.remove('show');panel.setAttribute('aria-hidden','true')}document.querySelector('#cartButton').onclick=openCart;document.querySelector('#closeCart').onclick=closeCart;overlay.onclick=closeCart;document.querySelector('#search').oninput=renderProducts;document.querySelectorAll('.category').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x===b));renderProducts()});document.querySelector('#checkout').onclick=()=>{if(!cart.length)return;closeCart();checkoutDialog.showModal()};document.querySelector('#orderForm').onsubmit=e=>{e.preventDefault();cart=[];save();checkoutDialog.close();alert('გმადლობთ! თქვენი შეკვეთა მიღებულია.');};renderCart();async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
      throw new Error("API შეცდომა");
    }

    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error(error);
    renderProducts();
  }
}

loadProducts();
