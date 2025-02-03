// main.ts

// 1. تعريف الواجهات لتحسين سلامة الأنواع
interface Coordinates {
    lat: number;
    lon: number;
}

interface FormData {
    name: string;
    phone: string;
    email: string;
    city: string;
}

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
function checkLocation(): void {
    if (!navigator.geolocation) {
        handleGeolocationError(new Error('Geolocation not supported'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
            const userCoords: Coordinates = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };

            if (!isWithinMallArea(userCoords)) {
                handleLocationError();
            }
        },
        (error: GeolocationPositionError) => {
            handleGeolocationError(error);
        }
    );
}

// 4. حساب المسافة مع أنواع البيانات الصحيحة
function isWithinMallArea(userCoords: Coordinates): boolean {
    const distance = calculateDistance(
        userCoords,
        APP_CONFIG.MALL_COORDINATES
    );

    return distance <= APP_CONFIG.MAX_DISTANCE_METERS;
}

function calculateDistance(
    point1: Coordinates,
    point2: Coordinates
): number {
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
function handleGeolocationError(error: GeolocationPositionError | Error): void {
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
    } else if (error.message === 'Geolocation not supported') {
        message = 'المتصفح لا يدعم خدمات الموقع الجغرافي';
    }

    alert(message);
    redirectToHome();
}

function handleLocationError(): void {
    alert("الخدمة متوفرة فقط داخل عزيز مول");
    redirectToHome();
}

// 6. إدارة النموذج مع التحقق من العناصر بشكل آمن
function initializeForm(): void {
    const form = document.getElementById('registrationForm') as HTMLFormElement | null;

    if (!form) {
        console.error('Form not found');
        return;
    }

    form.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();
        handleFormSubmission(form);
    });
}

function handleFormSubmission(form: HTMLFormElement): void {
    const formData: FormData = {
        name: (form.querySelector('#name') as HTMLInputElement)?.value.trim() || '',
        phone: (form.querySelector('#phone') as HTMLInputElement)?.value.trim() || '',
        email: (form.querySelector('#email') as HTMLInputElement)?.value.trim() || '',
        city: (form.querySelector('#city') as HTMLSelectElement)?.value || ''
    };

    if (validateForm(formData)) {
        window.location.href = 'confirmation.html';
    }
}

// 7. التحقق من النموذج مع إرجاع النتائج المفصلة
function validateForm(data: FormData): boolean {
    const errors: string[] = [];

    if (!data.name) errors.push('الاسم مطلوب');
    if (!data.phone.match(APP_CONFIG.PHONE_REGEX)) errors.push('رقم الجوال غير صحيح');
    if (!data.email.match(APP_CONFIG.EMAIL_REGEX)) errors.push('البريد الإلكتروني غير صحيح');
    if (!data.city) errors.push('يرجى اختيار المدينة');

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }

    return true;
}

// 8. التهيئة الآمنة للتطبيق
function initializeApp(): void {
    if (window.location.pathname.endsWith('index.html')) {
        checkLocation();
    }

    if (window.location.pathname.endsWith('register.html')) {
        initializeForm();
    }
}

// 9. الدوال المساعدة
function redirectToHome(): void {
    if (!window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
}

// بدء التشغيل
document.addEventListener('DOMContentLoaded', initializeApp);