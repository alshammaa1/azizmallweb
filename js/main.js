// main.ts
// 2. ثوابت التطبيق
const APP_CONFIG = {
    MALL_COORDINATES: {
        lat: 24.7136,
        lon: 46.6753
    },
    MAX_DISTANCE_METERS: 500,
    PHONE_REGEX: /^05\d{8}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};
// 3. التحقق من الموقع الجغرافي (مع معالجة الأخطاء بشكل صحيح)
function checkLocation() {
    if (!navigator.geolocation) {
        handleGeolocationError(new Error('Geolocation not supported'));
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const userCoords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        if (!isWithinMallArea(userCoords)) {
            handleLocationError();
        }
    }, (error) => {
        handleGeolocationError(error);
    });
}
// 4. حساب المسافة مع أنواع البيانات الصحيحة
function isWithinMallArea(userCoords) {
    const distance = calculateDistance(userCoords, APP_CONFIG.MALL_COORDINATES);
    return distance <= APP_CONFIG.MAX_DISTANCE_METERS;
}
function calculateDistance(point1, point2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lon - point1.lon) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
// 5. معالجة الأخطاء المحسنة
function handleGeolocationError(error) {
    let message = 'حدث خطأ غير متوقع';
    if (error instanceof GeolocationPositionError) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'يجب السماح بصلاحية الموقع الجغرافي';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'معلومات الموقع غير متوفرة';
                break;
            case error.TIMEOUT:
                message = 'انتهى الوقت المخصص للحصول على الموقع';
                break;
        }
    }
    else if (error.message === 'Geolocation not supported') {
        message = 'المتصفح لا يدعم خدمات الموقع الجغرافي';
    }
    alert(message);
    redirectToHome();
}
function handleLocationError() {
    alert("الخدمة متوفرة فقط داخل عزيز مول");
    redirectToHome();
}
// 6. إدارة النموذج مع التحقق من العناصر بشكل آمن
function initializeForm() {
    const form = document.getElementById('registrationForm');
    if (!form) {
        console.error('Form not found');
        return;
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(form);
    });
}
function handleFormSubmission(form) {
    var _a, _b, _c, _d;
    const formData = {
        name: ((_a = form.querySelector('#name')) === null || _a === void 0 ? void 0 : _a.value.trim()) || '',
        phone: ((_b = form.querySelector('#phone')) === null || _b === void 0 ? void 0 : _b.value.trim()) || '',
        email: ((_c = form.querySelector('#email')) === null || _c === void 0 ? void 0 : _c.value.trim()) || '',
        city: ((_d = form.querySelector('#city')) === null || _d === void 0 ? void 0 : _d.value) || ''
    };
    if (validateForm(formData)) {
        window.location.href = 'confirmation.html';
    }
}
// 7. التحقق من النموذج مع إرجاع النتائج المفصلة
function validateForm(data) {
    const errors = [];
    if (!data.name)
        errors.push('الاسم مطلوب');
    if (!data.phone.match(APP_CONFIG.PHONE_REGEX))
        errors.push('رقم الجوال غير صحيح');
    if (!data.email.match(APP_CONFIG.EMAIL_REGEX))
        errors.push('البريد الإلكتروني غير صحيح');
    if (!data.city)
        errors.push('يرجى اختيار المدينة');
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    return true;
}
// 8. التهيئة الآمنة للتطبيق
function initializeApp() {
    if (window.location.pathname.endsWith('index.html')) {
        checkLocation();
    }
    if (window.location.pathname.endsWith('register.html')) {
        initializeForm();
    }
}
// 9. الدوال المساعدة
function redirectToHome() {
    if (!window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
}
// بدء التشغيل
document.addEventListener('DOMContentLoaded', initializeApp);
