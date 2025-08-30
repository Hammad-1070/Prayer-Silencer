// Prayer Silencer App JavaScript
class PrayerSilencerApp {
    constructor() {
        this.currentLanguage = 'en';
        this.prayers = [
            {
                id: "fajr",
                nameEn: "Fajr",
                nameAr: "فجر",
                defaultTime: "05:30",
                icon: "🌅"
            },
            {
                id: "dhuhr",
                nameEn: "Dhuhr", 
                nameAr: "ظہر",
                defaultTime: "12:30",
                icon: "☀️"
            },
            {
                id: "asr",
                nameEn: "Asr",
                nameAr: "عصر", 
                defaultTime: "16:00",
                icon: "🌤️"
            },
            {
                id: "maghrib",
                nameEn: "Maghrib",
                nameAr: "مغرب",
                defaultTime: "18:30",
                icon: "🌅"
            },
            {
                id: "isha",
                nameEn: "Isha",
                nameAr: "عشاء",
                defaultTime: "20:00", 
                icon: "🌙"
            },
            {
                id: "jummah",
                nameEn: "Jummah",
                nameAr: "جمعہ",
                defaultTime: "13:00",
                icon: "🕌"
            }
        ];

        this.translations = {
            en: {
                appTitle: "Prayer Silencer",
                currentTime: "Current Time",
                nextPrayer: "Next Prayer",
                settings: "Settings",
                silentMode: "Silent Mode",
                enabled: "Enabled",
                disabled: "Disabled", 
                minutesBefore: "Minutes Before",
                minutesAfter: "Minutes After",
                prayerTime: "Prayer Time",
                save: "Save",
                cancel: "Cancel",
                language: "Language",
                about: "About",
                help: "Help",
                home: "Home",
                settingsTitle: "App Settings",
                aboutTitle: "About Prayer Silencer",
                aboutText: "Prayer Silencer is a respectful app designed to help Muslims maintain focus during prayer times by automatically managing phone silent mode. Set custom timings for each prayer and let the app handle the rest.",
                globalSettings: "Global Settings",
                notifications: "Notifications",
                soundProfile: "Sound Profile",
                appVersion: "Version 1.0.0",
                developer: "Developed with care for the Muslim community"
            },
            ur: {
                appTitle: "نماز خاموشی",
                currentTime: "موجودہ وقت",
                nextPrayer: "اگلی نماز",
                settings: "ترتیبات",
                silentMode: "خاموش موڈ",
                enabled: "فعال",
                disabled: "غیر فعال",
                minutesBefore: "منٹ پہلے",
                minutesAfter: "منٹ بعد", 
                prayerTime: "نماز کا وقت",
                save: "محفوظ کریں",
                cancel: "منسوخ کریں",
                language: "زبان",
                about: "معلومات",
                help: "مدد",
                home: "گھر",
                settingsTitle: "ایپ کی ترتیبات",
                aboutTitle: "نماز خاموشی کے بارے میں",
                aboutText: "نماز خاموشی ایک احترام سے بھرپور ایپ ہے جو مسلمانوں کو نماز کے وقت فون کی خاموش موڈ خودکار طریقے سے منظم کرکے توجہ برقرار رکھنے میں مدد کرتی ہے۔ ہر نماز کے لیے مخصوص وقت طے کریں اور باقی کام ایپ کو کرنے دیں۔",
                globalSettings: "عمومی ترتیبات",
                notifications: "اطلاعات",
                soundProfile: "آواز کی پروفائل",
                appVersion: "ورژن ۱.۰.۰",
                developer: "مسلم کمیونٹی کے لیے محبت سے تیار کیا گیا"
            }
        };

        // In-memory storage for settings
        this.prayerSettings = {};
        this.currentPrayerModal = null;
        this.currentPage = 'home';

        this.init();
    }

    init() {
        this.initializePrayerSettings();
        this.bindEvents();
        this.updateClock();
        this.updateLanguage();
        this.updatePrayerDisplay();
        this.createSettingsPage();
        this.createAboutPage();
        
        // Start real-time updates
        setInterval(() => {
            this.updateClock();
            this.updateNextPrayer();
        }, 1000);
    }

    initializePrayerSettings() {
        // Initialize default settings for each prayer
        this.prayers.forEach(prayer => {
            this.prayerSettings[prayer.id] = {
                time: prayer.defaultTime,
                enabled: true,
                minutesBefore: 5,
                minutesAfter: 10
            };
        });
    }

    bindEvents() {
        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Prayer card clicks
        document.querySelectorAll('.prayer-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const prayerId = card.dataset.prayer;
                this.openPrayerModal(prayerId);
            });
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelSettings').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.savePrayerSettings();
        });

        // Form events
        document.getElementById('enableSilentMode').addEventListener('change', (e) => {
            this.toggleSilentModeSettings(e.target.checked);
        });

        document.getElementById('prayerTime').addEventListener('change', () => {
            this.updateSilentPeriodPreview();
        });

        document.getElementById('minutesBefore').addEventListener('change', () => {
            this.updateSilentPeriodPreview();
        });

        document.getElementById('minutesAfter').addEventListener('change', () => {
            this.updateSilentPeriodPreview();
        });

        // Navigation events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e.currentTarget);
            });
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closePage();
            }
        });
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ur' : 'en';
        this.updateLanguage();
    }

    updateLanguage() {
        const html = document.documentElement;
        const langButton = document.getElementById('currentLang');
        
        if (this.currentLanguage === 'ur') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ur');
            langButton.textContent = 'اردو';
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            langButton.textContent = 'EN';
        }

        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });

        // Update prayer names
        document.querySelectorAll('[data-translate-prayer]').forEach(element => {
            const prayerId = element.getAttribute('data-translate-prayer');
            const prayer = this.prayers.find(p => p.id === prayerId);
            if (prayer) {
                element.textContent = this.currentLanguage === 'ur' ? prayer.nameAr : prayer.nameEn;
            }
        });

        // Update settings and about pages if they exist
        this.updateSettingsPageLanguage();
        this.updateAboutPageLanguage();

        this.updateNextPrayer();
    }

    updateClock() {
        const now = new Date();
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };

        // Format time and date based on current language
        const locale = this.currentLanguage === 'ur' ? 'ur-PK' : 'en-US';
        
        document.getElementById('currentTime').textContent = now.toLocaleTimeString(locale, timeOptions);
        document.getElementById('currentDate').textContent = now.toLocaleDateString(locale, dateOptions);
        
        // Proper Hijri date based on current language
        if (this.currentLanguage === 'ur') {
            document.getElementById('hijriDate').textContent = "۲۸ صفر ۱۴۴۷";
        } else {
            document.getElementById('hijriDate').textContent = "28 Safar 1447";
        }
    }

    updatePrayerDisplay() {
        this.prayers.forEach(prayer => {
            const card = document.querySelector(`[data-prayer="${prayer.id}"]`);
            if (card) {
                const timeElement = card.querySelector('.prayer-time');
                const settingsPreview = card.querySelector('.prayer-settings-preview');
                const statusIndicator = card.querySelector('.status-indicator');
                
                const settings = this.prayerSettings[prayer.id];
                
                // Update time display
                const time24 = settings.time;
                const timeFormatted = this.formatTime12Hour(time24);
                timeElement.textContent = timeFormatted;
                
                // Update settings preview
                const beforeText = this.currentLanguage === 'ur' ? 
                    `📵 ${settings.minutesBefore} منٹ پہلے` : 
                    `📵 ${settings.minutesBefore}min before`;
                const afterText = this.currentLanguage === 'ur' ? 
                    `🔔 ${settings.minutesAfter} منٹ بعد` : 
                    `🔔 ${settings.minutesAfter}min after`;
                
                settingsPreview.innerHTML = `
                    <span class="setting-item">${beforeText}</span>
                    <span class="setting-item">${afterText}</span>
                `;
                
                // Update status indicator
                statusIndicator.className = settings.enabled ? 'status-indicator active' : 'status-indicator inactive';
            }
        });
        
        this.updateNextPrayer();
    }

    updateNextPrayer() {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        let nextPrayer = null;
        let shortestDistance = Infinity;
        
        this.prayers.forEach(prayer => {
            const settings = this.prayerSettings[prayer.id];
            if (!settings.enabled) return;
            
            const [hours, minutes] = settings.time.split(':').map(Number);
            const prayerMinutes = hours * 60 + minutes;
            
            let distance = prayerMinutes - currentMinutes;
            if (distance < 0) {
                distance += 24 * 60; // Next day
            }
            
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nextPrayer = prayer;
            }
        });
        
        if (nextPrayer) {
            const nextPrayerName = this.currentLanguage === 'ur' ? nextPrayer.nameAr : nextPrayer.nameEn;
            document.getElementById('nextPrayerName').textContent = nextPrayerName;
            
            const hours = Math.floor(shortestDistance / 60);
            const minutes = shortestDistance % 60;
            
            let countdownText;
            if (this.currentLanguage === 'ur') {
                countdownText = hours > 0 ? `${hours}گھ ${minutes}م` : `${minutes}م`;
            } else {
                countdownText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            }
            
            document.getElementById('countdown').textContent = countdownText;
            
            // Update silent status
            this.updateSilentStatus(nextPrayer, shortestDistance);
        }
    }

    updateSilentStatus(nextPrayer, minutesUntilPrayer) {
        const settings = this.prayerSettings[nextPrayer.id];
        const silentStatusElement = document.getElementById('silentStatus');
        
        if (settings.enabled && minutesUntilPrayer <= settings.minutesBefore) {
            // Silent mode should be active
            silentStatusElement.innerHTML = `
                <div class="status status--success">
                    <span>${this.translations[this.currentLanguage].silentMode}</span>
                    <span>${this.translations[this.currentLanguage].enabled}</span>
                </div>
            `;
        } else {
            // Silent mode is not active
            silentStatusElement.innerHTML = `
                <div class="status status--info">
                    <span>${this.translations[this.currentLanguage].silentMode}</span>
                    <span>${this.translations[this.currentLanguage].disabled}</span>
                </div>
            `;
        }
    }

    openPrayerModal(prayerId) {
        this.currentPrayerModal = prayerId;
        const prayer = this.prayers.find(p => p.id === prayerId);
        const settings = this.prayerSettings[prayerId];
        
        if (!prayer || !settings) return;
        
        // Update modal title
        const prayerName = this.currentLanguage === 'ur' ? prayer.nameAr : prayer.nameEn;
        document.getElementById('modalTitle').textContent = `${prayerName} ${this.translations[this.currentLanguage].settings}`;
        
        // Populate form
        document.getElementById('prayerTime').value = settings.time;
        document.getElementById('enableSilentMode').checked = settings.enabled;
        document.getElementById('minutesBefore').value = settings.minutesBefore;
        document.getElementById('minutesAfter').value = settings.minutesAfter;
        
        this.toggleSilentModeSettings(settings.enabled);
        this.updateSilentPeriodPreview();
        
        // Show modal
        document.getElementById('prayerModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('prayerModal').classList.add('hidden');
        this.currentPrayerModal = null;
    }

    toggleSilentModeSettings(enabled) {
        const settingsDiv = document.getElementById('silentModeSettings');
        const previewDiv = document.getElementById('silentPeriodPreview');
        
        if (enabled) {
            settingsDiv.style.display = 'block';
            previewDiv.style.display = 'block';
        } else {
            settingsDiv.style.display = 'none';
            previewDiv.style.display = 'none';
        }
    }

    updateSilentPeriodPreview() {
        const prayerTime = document.getElementById('prayerTime').value;
        const minutesBefore = parseInt(document.getElementById('minutesBefore').value);
        const minutesAfter = parseInt(document.getElementById('minutesAfter').value);
        
        if (!prayerTime) return;
        
        const [hours, minutes] = prayerTime.split(':').map(Number);
        
        // Calculate start time (before prayer)
        const startTime = new Date();
        startTime.setHours(hours, minutes - minutesBefore, 0);
        
        // Calculate end time (after prayer)
        const endTime = new Date();
        endTime.setHours(hours, minutes + minutesAfter, 0);
        
        const startFormatted = this.formatTime12Hour(startTime.toTimeString().substr(0, 5));
        const endFormatted = this.formatTime12Hour(endTime.toTimeString().substr(0, 5));
        
        document.getElementById('previewTime').textContent = `${startFormatted} - ${endFormatted}`;
    }

    savePrayerSettings() {
        if (!this.currentPrayerModal) return;
        
        const prayerTime = document.getElementById('prayerTime').value;
        const enabled = document.getElementById('enableSilentMode').checked;
        const minutesBefore = parseInt(document.getElementById('minutesBefore').value);
        const minutesAfter = parseInt(document.getElementById('minutesAfter').value);
        
        // Validate inputs
        if (!prayerTime) {
            alert(this.currentLanguage === 'ur' ? 'براہ کرم نماز کا وقت منتخب کریں' : 'Please select prayer time');
            return;
        }
        
        // Update settings
        this.prayerSettings[this.currentPrayerModal] = {
            time: prayerTime,
            enabled: enabled,
            minutesBefore: minutesBefore,
            minutesAfter: minutesAfter
        };
        
        // Update display
        this.updatePrayerDisplay();
        
        // Close modal
        this.closeModal();
        
        // Show success message
        this.showNotification(
            this.currentLanguage === 'ur' ? 'ترتیبات محفوظ ہو گئیں' : 'Settings saved successfully',
            'success'
        );
    }

    formatTime12Hour(time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        
        return date.toLocaleTimeString(this.currentLanguage === 'ur' ? 'ur-PK' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    handleNavigation(navItem) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Handle navigation logic
        const icon = navItem.querySelector('.nav-icon').textContent;
        
        if (icon === '🏠') {
            this.showPage('home');
        } else if (icon === '⚙️') {
            this.showPage('settings');
        } else if (icon === 'ℹ️') {
            this.showPage('about');
        }
    }

    showPage(pageId) {
        this.currentPage = pageId;
        
        // Hide all pages
        document.querySelector('.dashboard').style.display = 'none';
        
        const settingsPage = document.getElementById('settingsPage');
        const aboutPage = document.getElementById('aboutPage');
        
        if (settingsPage) settingsPage.style.display = 'none';
        if (aboutPage) aboutPage.style.display = 'none';
        
        // Show requested page
        if (pageId === 'home') {
            document.querySelector('.dashboard').style.display = 'block';
        } else if (pageId === 'settings') {
            if (settingsPage) settingsPage.style.display = 'block';
        } else if (pageId === 'about') {
            if (aboutPage) aboutPage.style.display = 'block';
        }
    }

    closePage() {
        if (this.currentPage !== 'home') {
            this.showPage('home');
            // Reset nav to home
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.querySelector('.nav-icon').textContent === '🏠') {
                    item.classList.add('active');
                }
            });
        }
    }

    createSettingsPage() {
        const settingsPage = document.createElement('div');
        settingsPage.id = 'settingsPage';
        settingsPage.style.display = 'none';
        settingsPage.className = 'settings-page';
        
        settingsPage.innerHTML = `
            <div class="page-header">
                <h2 id="settingsPageTitle">${this.translations[this.currentLanguage].settingsTitle}</h2>
            </div>
            <div class="settings-content">
                <div class="card">
                    <div class="card__body">
                        <h3 id="globalSettingsTitle">${this.translations[this.currentLanguage].globalSettings}</h3>
                        <div class="setting-group">
                            <label class="form-label">
                                <input type="checkbox" checked disabled>
                                <span id="notificationsLabel">${this.translations[this.currentLanguage].notifications}</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="form-label" for="soundProfile" id="soundProfileLabel">${this.translations[this.currentLanguage].soundProfile}</label>
                            <select id="soundProfile" class="form-control" disabled>
                                <option>Silent</option>
                                <option>Vibrate</option>
                                <option>Do Not Disturb</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card__body">
                        <p class="app-info">
                            <span id="appVersionText">${this.translations[this.currentLanguage].appVersion}</span><br>
                            <span id="developerText">${this.translations[this.currentLanguage].developer}</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.main-content').appendChild(settingsPage);
    }

    createAboutPage() {
        const aboutPage = document.createElement('div');
        aboutPage.id = 'aboutPage';
        aboutPage.style.display = 'none';
        aboutPage.className = 'about-page';
        
        aboutPage.innerHTML = `
            <div class="page-header">
                <h2 id="aboutPageTitle">${this.translations[this.currentLanguage].aboutTitle}</h2>
            </div>
            <div class="about-content">
                <div class="card">
                    <div class="card__body">
                        <div class="app-logo">🕌</div>
                        <h3 class="app-name">${this.translations[this.currentLanguage].appTitle}</h3>
                        <p id="aboutText" class="about-description">
                            ${this.translations[this.currentLanguage].aboutText}
                        </p>
                        <div class="features-list">
                            <div class="feature-item">
                                <div class="feature-icon">⏰</div>
                                <div class="feature-text">
                                    ${this.currentLanguage === 'ur' ? 'ہر نماز کے لیے الگ وقت' : 'Individual prayer timing'}
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🔇</div>
                                <div class="feature-text">
                                    ${this.currentLanguage === 'ur' ? 'خودکار خاموش موڈ' : 'Automatic silent mode'}
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🌍</div>
                                <div class="feature-text">
                                    ${this.currentLanguage === 'ur' ? 'اردو اور انگریزی دونوں زبانیں' : 'Bilingual support'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.main-content').appendChild(aboutPage);
    }

    updateSettingsPageLanguage() {
        const settingsPage = document.getElementById('settingsPage');
        if (!settingsPage) return;
        
        document.getElementById('settingsPageTitle').textContent = this.translations[this.currentLanguage].settingsTitle;
        document.getElementById('globalSettingsTitle').textContent = this.translations[this.currentLanguage].globalSettings;
        document.getElementById('notificationsLabel').textContent = this.translations[this.currentLanguage].notifications;
        document.getElementById('soundProfileLabel').textContent = this.translations[this.currentLanguage].soundProfile;
        document.getElementById('appVersionText').textContent = this.translations[this.currentLanguage].appVersion;
        document.getElementById('developerText').textContent = this.translations[this.currentLanguage].developer;
    }

    updateAboutPageLanguage() {
        const aboutPage = document.getElementById('aboutPage');
        if (!aboutPage) return;
        
        document.getElementById('aboutPageTitle').textContent = this.translations[this.currentLanguage].aboutTitle;
        document.querySelector('.app-name').textContent = this.translations[this.currentLanguage].appTitle;
        document.getElementById('aboutText').textContent = this.translations[this.currentLanguage].aboutText;
        
        // Update feature list
        const featureTexts = aboutPage.querySelectorAll('.feature-text');
        const features = [
            this.currentLanguage === 'ur' ? 'ہر نماز کے لیے الگ وقت' : 'Individual prayer timing',
            this.currentLanguage === 'ur' ? 'خودکار خاموش موڈ' : 'Automatic silent mode',
            this.currentLanguage === 'ur' ? 'اردو اور انگریزی دونوں زبانیں' : 'Bilingual support'
        ];
        
        featureTexts.forEach((text, index) => {
            if (features[index]) {
                text.textContent = features[index];
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: this.currentLanguage === 'ur' ? 'auto' : '20px',
            left: this.currentLanguage === 'ur' ? '20px' : 'auto',
            background: type === 'success' ? 'var(--color-success)' : 
                       type === 'error' ? 'var(--color-error)' : 'var(--color-info)',
            color: 'white',
            padding: 'var(--space-12) var(--space-16)',
            borderRadius: 'var(--radius-base)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '9999',
            fontSize: 'var(--font-size-sm)',
            maxWidth: '300px',
            transform: 'translateY(-100px)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrayerSilencerApp();
});