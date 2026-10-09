import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <div className="footer-block">
        <div className="kitchen-revisor">
          <div className="title">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="50" viewBox="0 0 48 50" className="img"><g fill="#fff" fillRule="evenodd"><path d="M23.076 25.96c9.915 0 21.368-2.21 22.394-4.198s-12.764-4.64-12.764-4.64c-3.305 1.492-9.687 1.492-9.687 1.492s-6.382 0-9.687-1.492c0 0-13.733 2.707-12.707 4.695 1.082 1.934 12.25 4.143 22.45 4.143M31.625 13.367S29.688 2.652 28.263.553c-1.424-2.099-3.59 2.486-5.812 2.486S19.716.11 17.721 0c-2.05-.11-4.045 13.366-4.045 13.366s10.485 2.32 17.95 0M13.163 27.065s-.912 4.087 4.559 4.197c0 0 2.108 0 3.19-1.822.343-.553.855-.884 1.54-.884h.227c.627 0 1.197.331 1.539.884 1.082 1.822 3.19 1.822 3.19 1.822 5.471-.11 4.56-4.197 4.56-4.197-2.508.828-6.44.773-7.807.718h-2.679c.057-.056-5.242.22-8.319-.718"></path><path d="m11.51 26.567-4.216-.607L0 32.036h.684c3.248 0 11.852 2.65 11.852 2.65l-4.558 3.812c3.419.663 14.188 6.241 14.188 6.241l1.026-3.645c-8.604-6.131-11.681-14.527-11.681-14.527"></path><path d="m48 31.925-8.832-5.965-4.73.607c.285 1.492-.684 4.198-.684 4.198-13.619 9.998-11.396 18.89-11.396 18.89 5.413-10.384 17.323-11.82 17.323-11.82l-5.414-2.485C37.8 33.196 48 31.925 48 31.925"></path></g></svg>
            <span>Проверьте нашу кухню и получите додокоины — хватит на две пиццы</span>
          </div>
          <button>Заполнить анкету</button>
        </div>
        <div className="top">
          <div className='navigation-links'>
            <div className="section">
              <h4>Партнёрам</h4>
              <a>Франшиза</a>
              <a>Инвестиции</a>
              <a>Поставщикам</a>
              <a>Предложить помещение</a>
            </div>
            <div className="section">
              <h4>Это интересно</h4>
              <a>Экскурсии и мастер-классы</a>
              <a>Почему мы готовим без перчаток?</a>
            </div>
            <div className='section'>
              <h4>Контакты</h4>
              <a>8 800 302-00-60</a>
              <a>feedback@dodopizza.com</a>
            </div>
          </div>
          <div className="apps-gallery">
            <img src="https://storage.googleapis.com/pe-portal-consumer-prod-wagtail-static/images/googleplay-badge-01-getit.width-1440.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=wagtail%40pe-portal-consumer-prod.iam.gserviceaccount.com%2F20261009%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20261009T063947Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=21e591f5bae035625e68007c194c7e7c26dcbbb7bce6853fc9cca5f435224b7e082e77f69fdfa5f933f505692251a6fbe71dc65cb9e737556ddcf42596441667148bd98873af28dcbd1a500d68540a998c3cf173aaa7de119ef9c684fbe3d8c1f935be5a22f460a8d5c21eb8f4a34a0e204459362e9f16903d0d2fea42aec701798450c873a55c491ef98aef51cfe68508268d4d688c2e67faf414c8787f48765a2bf27cc402b1a3b2f654bc8a8319350e372bca35b7a63ea5ae0af30fbc7c99fb65afc4975e8b31465ebdb305a544e914e859d061225df66fe40a23559c8d4fc60c8b71203a283360319ea39ffce661112a8ee186670df4f598f10569ca1435" />
          </div>
        </div>
        <div className="middle">
          <div className="revenue">
            <h2>1 111 111 111 ₽</h2>
            <span>Выручка российской сети в этом месяце</span>
            <span>В прошлом — 1 234 567 890 ₽</span>
          </div>
          <div className="amount">
            <h2>1111 пиццерий</h2>
            <span>В 111 странах</span>
          </div>
        </div>
        <div className="footer-line"></div>
        <div className="bottom">
          <div className="underline">
            <div className="info">
              <span style={{ color: "#ada9aa" }}><span style={{ color: "#ada9aa", fontWeight: 800, fontSize: "17px"}}>не додо пицца</span> © 2026</span>
              <a>Правовая информация</a>
              <a>Калорийность и состав</a>
            </div>
            <div className="social-networks">
              <a className="button">VK</a>
              <a className="button">TG</a>
              <a className="button">YT</a>
            </div>
          </div>
          <div className="ERID">
            <span>© 2026 ООО “Не Додо Франчайзинг”</span>
            <span>ОГРН 1331333113131, ИНН 1131131131</span>
            <span>167001, Республика Коми, г. Сыктывкар, Октябрьский проспект, д. 16</span>
          </div>
        </div>

      </div>
    </footer >
  )
}