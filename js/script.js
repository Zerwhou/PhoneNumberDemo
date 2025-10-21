document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const countrySelect = document.getElementById('country');
    const quantityInput = document.getElementById('quantity');
    const formatSelect = document.getElementById('format');
    const generateBtn = document.getElementById('generate-btn');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const resultList = document.getElementById('result-list');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // 国家代码和前缀映射
    const countryPrefixes = {
        'CN': '86',  // 中国
        'US': '1',   // 美国
        'GB': '44',  // 英国
        'JP': '81',  // 日本
        'KR': '82'   // 韩国
    };
    
    // 国家号码格式和长度
    const countryFormats = {
        'CN': { minLength: 11, maxLength: 11 },  // 中国手机号11位
        'US': { minLength: 10, maxLength: 10 },  // 美国号码10位
        'GB': { minLength: 10, maxLength: 11 },  // 英国号码10-11位
        'JP': { minLength: 10, maxLength: 11 },  // 日本号码10-11位
        'KR': { minLength: 10, maxLength: 11 }   // 韩国号码10-11位
    };
    
    // 生成随机数字
    function generateRandomDigits(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }
    
    // 格式化电话号码
    function formatPhoneNumber(number, country, format) {
        // 简单格式化逻辑
        switch(format) {
            case 'INTERNATIONAL':
                return `+${countryPrefixes[country]} ${number}`;
            case 'NATIONAL':
                if (country === 'CN') {
                    return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
                } else if (country === 'US') {
                    return number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (country === 'GB') {
                    // 处理10位或11位英国号码
                    if (number.length === 10) {
                        return number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
                    } else {
                        return number.replace(/(\d{5})(\d{6})/, '$1 $2');
                    }
                } else if (country === 'JP') {
                    return number.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                } else if (country === 'KR') {
                    return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                }
                return number;
            case 'E164':
                return `+${countryPrefixes[country]}${number}`;
            default:
                return number;
        }
    }
    
    // 生成电话号码
    function generatePhoneNumbers() {
        const country = countrySelect.value;
        const quantity = parseInt(quantityInput.value);
        const format = formatSelect.value;
        
        if (quantity < 1 || quantity > 50) {
            alert('Please enter a quantity between 1 and 50');
            return;
        }
        
        resultList.innerHTML = '';
        
        for (let i = 0; i < quantity; i++) {
            const length = Math.floor(
                Math.random() * 
                (countryFormats[country].maxLength - countryFormats[country].minLength + 1) + 
                countryFormats[country].minLength
            );
            
            const randomNumber = generateRandomDigits(length);
            const formattedNumber = formatPhoneNumber(randomNumber, country, format);
            
            const phoneItem = document.createElement('div');
            phoneItem.className = 'phone-number-item';
            phoneItem.innerHTML = `
                <span class="phone-number">${formattedNumber}</span>
                <button class="copy-btn" data-number="${formattedNumber}">Copy</button>
            `;
            
            resultList.appendChild(phoneItem);
        }
        
        // 添加复制按钮事件
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const number = this.getAttribute('data-number');
                copyToClipboard(number);
                
                // 显示复制成功提示
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.color = 'var(--success-color)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 1500);
            });
        });
    }
    
    // 复制到剪贴板
    function copyToClipboard(text) {
        // 使用现代Clipboard API，如果可用
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .catch(err => {
                    // 如果失败，回退到旧方法
                    fallbackCopyToClipboard(text);
                });
        } else {
            // 回退到旧方法
            fallbackCopyToClipboard(text);
        }
    }
    
    // 回退的复制方法
    function fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // 避免滚动到底部
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('无法复制文本: ', err);
        }
        
        document.body.removeChild(textarea);
    }
    
    // 复制所有号码
    function copyAllNumbers() {
        const phoneNumbers = Array.from(document.querySelectorAll('.phone-number'))
            .map(span => span.textContent)
            .join('\n');
            
        if (phoneNumbers) {
            copyToClipboard(phoneNumbers);
            
            // 显示复制成功提示
            const originalText = copyAllBtn.textContent;
            copyAllBtn.textContent = 'All Copied!';
            copyAllBtn.style.backgroundColor = 'var(--success-color)';
            
            setTimeout(() => {
                copyAllBtn.textContent = originalText;
                copyAllBtn.style.backgroundColor = '';
            }, 1500);
        }
    }
    
    // FAQ切换
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // 关闭其他打开的FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.toggle-icon').textContent = '+';
                }
            });
            
            // 切换当前FAQ
            item.classList.toggle('active');
            const icon = item.querySelector('.toggle-icon');
            icon.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });
    
    // 添加事件监听器
    generateBtn.addEventListener('click', generatePhoneNumbers);
    copyAllBtn.addEventListener('click', copyAllNumbers);
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            console.log("Scrolling to:", targetId); // 调试信息
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                console.log("Target found:", targetElement); // 调试信息
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                console.log("Target not found:", targetId); // 调试信息
            }
        });
    });
});