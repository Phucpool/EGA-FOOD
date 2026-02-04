document.addEventListener('DOMContentLoaded', () => {
    // --- PHẦN 1: XỬ LÝ CUỘN VÀ NÚT BẤM ---
    const scrollContainer = document.querySelector('.navigation-horizontal-wrapper nav');
    const btnLeft = document.getElementById('scrollLeft');
    const btnRight = document.getElementById('scrollRight');

    const updateButtons = () => {
        if (!scrollContainer || !btnLeft || !btnRight) return;

        // Tính toán xem có cần cuộn không
        // scrollWidth: tổng độ dài nội dung
        // clientWidth: độ rộng đang hiển thị
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        // Nếu nội dung ngắn, nằm gọn trong khung -> Ẩn nút
        if (maxScroll <= 0) {
            btnLeft.style.display = 'none';
            btnRight.style.display = 'none';
            return; // Dừng luôn, không làm gì nữa
        }

        // Nếu nội dung dài -> LUÔN HIỆN NÚT (Sửa lại đoạn này)
        btnLeft.style.display = 'flex';
        btnRight.style.display = 'flex';

        // Kiểm tra disable nút (làm mờ khi đến đầu/cuối)
        // Cho sai số 2px
        btnLeft.disabled = scrollContainer.scrollLeft <= 2;
        btnRight.disabled = scrollContainer.scrollLeft >= maxScroll - 2;
        
        // Chỉnh opacity để người dùng biết nút bị vô hiệu hóa
        btnLeft.style.opacity = btnLeft.disabled ? '0.3' : '1';
        btnRight.style.opacity = btnRight.disabled ? '0.3' : '1';
    };

    if (scrollContainer && btnLeft && btnRight) {
        // Sự kiện click
        btnLeft.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        });

        btnRight.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });

        // Sự kiện cuộn và resize
        scrollContainer.addEventListener('scroll', () => window.requestAnimationFrame(updateButtons));
        window.addEventListener('resize', updateButtons);
        
        // Chạy ngay khi load
        updateButtons();
    }

    // --- PHẦN 2: XỬ LÝ SUBMENU TRÀN RA NGOÀI (Code fixed position) ---
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const submenu = item.querySelector('.submenu');
        const link = item.querySelector('.menu-item__link');

        if (!submenu || !link) return;

        item.addEventListener('mouseenter', () => {
            const rect = link.getBoundingClientRect();
            
            // Chuyển sang fixed để nổi lên trên cùng
            submenu.style.position = 'fixed';
            submenu.style.top = `${rect.bottom}px`; 
            
            if (submenu.classList.contains('mega-menu')) {
                submenu.style.left = '10%';
                submenu.style.transform = 'translateX(-50%) translateY(0)';
                submenu.style.width = '100%';
                submenu.style.maxWidth = '1400px';
            } else {
                submenu.style.left = `${rect.left}px`;
                submenu.style.transform = 'translateY(0)';
                submenu.style.width = 'auto';
                submenu.style.minWidth = '220px';
            }
            submenu.classList.add('is-visible');
        });

        item.addEventListener('mouseleave', () => {
            submenu.classList.remove('is-visible');
            // Đợi animation xong mới reset style
            setTimeout(() => {
                if (!item.matches(':hover')) {
                    submenu.style.position = 'absolute';
                    submenu.style.top = '100%';
                    submenu.style.left = '0';
                    submenu.style.transform = 'translateY(10px)';
                }
            }, 300);
        });
    });

    // Ẩn submenu khi cuộn trang
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.submenu.is-visible').forEach(sub => {
            sub.classList.remove('is-visible');
            sub.style.position = 'absolute';
        });
    });
});

 document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    
    // Ngưỡng cuộn (300-400px tương đương khoảng 3-4 lần lăn chuột)
    const SCROLL_THRESHOLD = 400; 

    const handleScroll = () => {
        if (!header) return;

        const currentScroll = window.scrollY;

        if (currentScroll > SCROLL_THRESHOLD) {
            // Nếu đã cuộn sâu xuống > 400px -> Hiện Header dính
            if (!header.classList.contains('header-sticky')) {
                header.classList.add('header-sticky');
            }
        } else {
            // Nếu đang ở đoạn đầu trang (< 400px) -> Gỡ Header dính
            // Lúc này Header sẽ nằm im ở đầu trang web, cuộn là mất
            header.classList.remove('header-sticky');
        }
    };

    // Lắng nghe sự kiện cuộn
    window.addEventListener('scroll', () => {
        // Dùng requestAnimationFrame để tối ưu hiệu năng
        window.requestAnimationFrame(handleScroll);
    });
});

 var track = document.getElementById("banner-track");
    var index = 1; // Bắt đầu ở số 1 (Vì số 0 là ảnh copy)
    var slideWidth = 100;
    var transitionTime = 500;
    var isTransitioning = false; // Cờ để chặn bấm liên tục
    var autoSlideInterval;

    // Khởi tạo vị trí ban đầu (để hiện Ảnh 1 thay vì Ảnh Copy 2)
    track.style.transform = `translate3d(-${index * slideWidth}%, 0, 0)`;

    function moveSlide(direction) {
        if (isTransitioning) return; // Nếu đang trượt thì chặn click
        isTransitioning = true;
        
        // Reset thời gian tự động chạy khi bấm nút
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => moveSlide(1), 3000);

        // Cập nhật index
        index += direction;

        // Slide mượt
        track.style.transition = `transform ${transitionTime}ms ease-in-out`;
        track.style.transform = `translate3d(-${index * slideWidth}%, 0, 0)`;

        // Xử lý vòng lặp khi trượt xong
        setTimeout(() => {
            // 1. Nếu đi quá đà sang phải (đến bản copy cuối)
            if (index === 3) {
                track.style.transition = "none"; // Tắt hiệu ứng
                index = 1; // Nhảy về ảnh gốc 1
                track.style.transform = `translate3d(-${index * slideWidth}%, 0, 0)`;
            }
            // 2. Nếu đi lùi quá đà sang trái (đến bản copy đầu)
            else if (index === 0) {
                track.style.transition = "none"; // Tắt hiệu ứng
                index = 2; // Nhảy về ảnh gốc 2
                track.style.transform = `translate3d(-${index * slideWidth}%, 0, 0)`;
            }
            
            isTransitioning = false; // Mở khóa cho lần bấm tiếp theo
        }, transitionTime);
    }

    // Tự động chạy (Mặc định hướng sang phải: 1)
    autoSlideInterval = setInterval(() => moveSlide(1), 3000);

   // Flash Sale Countdown Timer
document.addEventListener('DOMContentLoaded', () => {
    function updateCountdown() {
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!hoursEl || !minutesEl || !secondsEl) return;
        
        let hours = parseInt(hoursEl.textContent);
        let minutes = parseInt(minutesEl.textContent);
        let seconds = parseInt(secondsEl.textContent);
        
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        
        if (hours < 0) {
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);

    // Button handlers
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('.product-name').textContent;
            alert('Đã thêm ' + productName + ' vào giỏ hàng!');
        });
    });

    // Utility buttons handlers
    document.querySelectorAll('.utility-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productName = this.closest('.product-card').querySelector('.product-name').textContent;
            const action = this.title;
            alert(action + ': ' + productName);
        });
    });
});

  // Product Tabs Functionality - SCOPED
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chọn tab buttons trong section-product-tabs
    const productTabsSection = document.querySelector('.section-product-tabs');
    if (!productTabsSection) return;

    const tabButtons = productTabsSection.querySelectorAll('.tab-btn');
    const tabContents = productTabsSection.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class
            button.classList.add('active');
            productTabsSection.querySelector('#' + targetTab).classList.add('active');
        });
    });

    // Action button handlers - chỉ trong section này
    productTabsSection.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card-horizontal').querySelector('.product-name').textContent;
            alert('Đã thêm ' + productName + ' vào giỏ hàng!');
        });
    });
});

// Product Banner Grid - Complete JavaScript (SCOPED)
(function() {
    const section = document.querySelector('.section-product-banner-grid');
    if (!section) return;

    // Action button handlers
    section.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('.product-name').textContent;
            alert('Đã thêm ' + productName + ' vào giỏ hàng!');
        });
    });

    // Utility button handlers
    section.querySelectorAll('.utility-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productName = this.closest('.product-card').querySelector('.product-name').textContent;
            const tooltipText = this.querySelector('.utility-tooltip').textContent;
            alert(tooltipText + ': ' + productName);
        });
    });

    // Sticky Banner Scroll Effect
    const bannerArea = section.querySelector('.banner-area');
    const bannerWrapper = section.querySelector('.banner-sticky-wrapper');
    const productGrid = section.querySelector('.product-banner-grid');
    
    if (bannerArea && bannerWrapper && productGrid) {
        function updateBannerPosition() {
            // Get all necessary measurements
            const gridRect = productGrid.getBoundingClientRect();
            const bannerRect = bannerArea.getBoundingClientRect();
            const wrapperHeight = bannerWrapper.offsetHeight;
            
            // Calculate positions relative to viewport
            const bannerTop = bannerRect.top;
            const gridBottom = gridRect.bottom;
            
            // Check if banner should stop scrolling
            // Stop when banner bottom reaches grid bottom
            const shouldStop = (bannerTop + wrapperHeight) >= gridBottom - 20;
            
            if (shouldStop && gridRect.top < 0) {
                // Banner reached bottom of grid - make it absolute
                bannerWrapper.style.position = 'absolute';
                bannerWrapper.style.top = 'auto';
                bannerWrapper.style.bottom = '0';
            } else {
                // Banner is sticky and follows scroll
                bannerWrapper.style.position = 'sticky';
                bannerWrapper.style.top = '20px';
                bannerWrapper.style.bottom = 'auto';
            }
        }
        
        // Update on scroll with requestAnimationFrame for performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateBannerPosition();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Update on window resize
        window.addEventListener('resize', updateBannerPosition);
        
        // Initial update after a short delay to ensure layout is ready
        setTimeout(updateBannerPosition, 100);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('brandTrack');
    const prevBtn = document.getElementById('brandPrevBtn');
    const nextBtn = document.getElementById('brandNextBtn');
    const dots = document.querySelectorAll('.brand-dot');

    // Cấu hình
    const itemWidth = 210; // 180px width + 30px gap
    let autoPlayInterval;

    // Hàm cuộn
    const scrollBrand = (direction) => {
        if (direction === 'left') {
            track.scrollLeft -= itemWidth;
        } else {
            // Kiểm tra nếu đã cuộn đến cuối thì quay về đầu (Infinite loop giả lập)
            if (track.scrollLeft >= (track.scrollWidth - track.clientWidth - 10)) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollLeft += itemWidth;
            }
        }
        updateActiveDot();
    };

    // Sự kiện Click
    prevBtn.addEventListener('click', () => {
        scrollBrand('left');
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        scrollBrand('right');
        resetAutoPlay();
    });

    // Auto Play Function
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
            scrollBrand('right');
        }, 3000); // 3 giây tự chạy
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    // Stop AutoPlay khi hover chuột vào
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', startAutoPlay);

    // Cập nhật Dot Active (đơn giản hóa theo vị trí scroll)
    const updateActiveDot = () => {
        const scrollPercentage = track.scrollLeft / (track.scrollWidth - track.clientWidth);
        const activeIndex = Math.round(scrollPercentage * (dots.length - 1));
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    };

    // Lắng nghe sự kiện scroll để cập nhật dot (cho cả trường hợp vuốt tay)
    track.addEventListener('scroll', updateActiveDot);

    // Khởi chạy
    startAutoPlay();
});

 // ===== FLOATING CONTACT BUTTON JAVASCRIPT =====
    document.addEventListener('DOMContentLoaded', () => {
        const mainBtn = document.getElementById('mainFloatingBtn');
        const closeBtn = document.getElementById('closeFloatingBtn');
        const subMenu = document.getElementById('floatingSubMenu');

        // Mở menu khi click nút chính
        mainBtn.addEventListener('click', () => {
            // Hiện menu
            subMenu.classList.add('active');
            
            // Ẩn nút chính, hiện nút đóng
            mainBtn.style.display = 'none';
            closeBtn.style.display = 'flex';
        });

        // Đóng menu khi click nút X
        closeBtn.addEventListener('click', () => {
            // Ẩn menu
            subMenu.classList.remove('active');
            
            // Hiện nút chính, ẩn nút đóng
            closeBtn.style.display = 'none';
            mainBtn.style.display = 'flex';
        });

        // Đóng menu khi click vào nút con (optional - nếu muốn tự động đóng)
        document.querySelectorAll('.floating-sub-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Delay một chút để animation hoàn thành
                setTimeout(() => {
                    subMenu.classList.remove('active');
                    closeBtn.style.display = 'none';
                    mainBtn.style.display = 'flex';
                }, 300);
            });
        });
    });

  // ===== NOTIFICATION POPUP JAVASCRIPT =====
    document.addEventListener('DOMContentLoaded', () => {
        const notificationBell = document.getElementById('notificationBell');
        const notificationPopup = document.getElementById('notificationPopup');
        const closeNotificationBtn = document.getElementById('closeNotificationBtn');

        // Mảng dữ liệu mẫu cho các thông báo
        const notifications = [
            {
                customer: 'Trần Thị Diệu',
                product: 'Gà Rán (4 Miếng)',
                image: 'https://bizweb.dktcdn.net/thumb/grande/100/559/903/products/product-image-1-9e807c8a-33f3-4edd-8d64-7195959a2e7d-998c4395-2ef2-4dd2-b33c-f1662989342e-4599d2cc-1809-4293-a7e9-155ad27a070f.jpg?v=1742375320697',
                remaining: 12
            },
            {
                customer: 'Lê Văn Cam',
                product: 'Pizza Hải Sản (S)',
                image: 'https://bizweb.dktcdn.net/thumb/grande/100/559/903/products/productimage1-e0caebe2-dade-4ba7-8bfa-c5d0abfff8e6.jpg?v=1742376524117',
                remaining: 8
            },
            {
                customer: 'Phạm Thị Duyên',
                product: 'Burger Zinger',
                image: 'https://bizweb.dktcdn.net/thumb/grande/100/559/903/products/product-image-3-7908cd6a-7ae2-44bf-8064-24e41506895d-2e15fa87-0ad3-4cd5-b208-db184be0c7b8.jpg?v=1742360902203',
                remaining: 15
            }
        ];

        let currentNotificationIndex = 0;
        let autoShowTimer;
        let hideTimer;

        // Hàm cập nhật nội dung popup
        const updateNotificationContent = (index) => {
            const notification = notifications[index];
            document.getElementById('customerName').textContent = notification.customer;
            document.getElementById('productName').textContent = notification.product;
            document.querySelector('.notification-product-img img').src = notification.image;
            document.getElementById('remainingCount').textContent = notification.remaining;
            
            // Cập nhật thời gian (giả lập: 1-5 phút trước)
            const minutes = Math.floor(Math.random() * 5) + 1;
            document.getElementById('purchaseTime').textContent = `${minutes} phút trước`;
        };

        // Hàm hiện popup
        const showNotification = () => {
            notificationPopup.classList.add('active');

            // Tự động ẩn sau 6 giây
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                hideNotification();
            }, 6000);
        };

        // Hàm ẩn popup
        const hideNotification = () => {
            notificationPopup.classList.remove('active');
            clearTimeout(hideTimer);
        };

        // Click icon chuông -> hiện popup
        notificationBell.addEventListener('click', () => {
            // Lặp qua các thông báo
            currentNotificationIndex = (currentNotificationIndex + 1) % notifications.length;
            updateNotificationContent(currentNotificationIndex);
            showNotification();
        });

        // Click nút đóng -> ẩn popup
        closeNotificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideNotification();
        });

        // Tự động hiện popup khi load trang
        updateNotificationContent(currentNotificationIndex);
        setTimeout(() => {
            showNotification();
            
            // Sau đó, cứ 15 giây hiện một popup mới (nếu user không tương tác)
            setInterval(() => {
                if (!notificationPopup.classList.contains('active')) {
                    currentNotificationIndex = (currentNotificationIndex + 1) % notifications.length;
                    updateNotificationContent(currentNotificationIndex);
                    showNotification();
                }
            }, 15000);
        }, 1500); // Delay 1.5s để trang load xong
    });

 // ===== SCROLL TO TOP BUTTON JAVASCRIPT =====
    document.addEventListener('DOMContentLoaded', () => {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

        // Ngưỡng hiển thị nút (300px)
        const SCROLL_THRESHOLD = 300;

        // Hàm cập nhật trạng thái nút
        const updateScrollToTopBtn = () => {
            if (window.scrollY > SCROLL_THRESHOLD) {
                // Nếu đã cuộn > 300px -> Hiện nút
                scrollToTopBtn.classList.add('show');
            } else {
                // Nếu chưa cuộn đủ -> Ẩn nút
                scrollToTopBtn.classList.remove('show');
            }
        };

        // Lắng nghe sự kiện scroll
        window.addEventListener('scroll', () => {
            // Dùng requestAnimationFrame để tối ưu hiệu năng
            window.requestAnimationFrame(updateScrollToTopBtn);
        });

        // Click nút -> Cuộn mượt về đầu trang
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Animation cuộn mượt
            });
        });

        // Cập nhật ngay khi load trang
        updateScrollToTopBtn();
    });