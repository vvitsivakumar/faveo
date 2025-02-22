/**
 * Turkish translate
 * @type Object
 */
const tr = {
    btn: {
        about: 'Hakkında',
        back: 'Geri',
        cancel: 'İptal',
        clear: 'Temizle',
        copy: 'Kopyala',
        cut: 'Kes',
        delete: 'Sil',
        edit: 'Düzenle',
        forward: 'İleri',
        folder: 'Yeni klasör',
        file: 'Yeni dosya',
        fullScreen: 'Tam ekran',
        grid: 'Izgara',
        paste: 'Yapıştır',
        refresh: 'Yenile',
        submit: 'Gönder',
        table: 'Tablo',
        upload: 'Yükle',
        uploadSelect: 'Dosyaları seç',
        clearSelect: 'Seçilen tüm dosyaları temizle',
        hidden: ' Gizli dosyalar',
        confirm: 'Onaylamak',
    },
    clipboard: {
        actionType: 'İşlem türü',
        copy: 'Kopyala',
        cut: 'Yapıştır',
        none: 'Hiç bir şey seçilmedi',
        title: 'Pano',
    },
    contextMenu: {
        copy: 'Kopyala',
        cut: 'Yapıştır',
        delete: 'Sil',
        download: 'İndir',
        info: 'Seçilenler:',
        open: 'Aç',
        paste: 'Yapıştır',
        properties: 'Özellikler',
        rename: 'Yeniden adlandır',
        select: 'Seç',
        view: 'Gör',
        zip: 'Zip',
        unzip: 'Zip aç',
        edit: 'Düzenle',
        audioPlay: 'Oynat',
        videoPlay: 'Oynat',
    },
    info: {
        directories: 'Klasörler:',
        files: 'Dosyalar:',
        selected: 'Seçilenler:',
        selectedSize: 'Dosyaların boyutu:',
        size: 'Dosyaların boyutu:',
    },
    manager: {
        table: {
            date: 'Tarih',
            folder: 'Klasör',
            name: 'İsim',
            size: 'Boyut',
            type: 'Tür',
        },
    },
    modal: {
        about: {
            developer: 'Geliştirici',
            name: 'Laravel File Manager',
            title: 'Hakkında',
            version: 'Sürüm',
        },
        delete: {
            noSelected: 'Hiç bir şey seçilmedi!',
            title: 'Sil',
        },
        newFile: {
            fieldName: 'Dosya adı',
            fieldFeedback: 'Aynı isimli dosya var!',
            title: 'Yeni dosya yarat',
        },
        newFolder: {
            fieldName: 'Klasör adı',
            fieldFeedback: 'Aynı isimli klasör var!',
            title: 'Yeni klasör yarat',
        },
        preview: {
            title: 'Önizleme',
        },
        properties: {
            disk: 'Disk',
            modified: 'Değiştirilme',
            name: 'İsim',
            path: 'Yol',
            size: 'Boyut',
            title: 'Özellikler',
            type: 'Tür',
            url: 'URL',
            access: 'Erişim',
            access_0: 'Erişim engellendi',
            access_1: 'Salt okunur',
            access_2: 'Okuma ve yazma',
        },
        rename: {
            directoryExist: 'Klasör mevcut',
            fieldName: 'Yeni isim girin',
            fieldFeedback: 'Geçersiz isim',
            fileExist: 'Dosya mevcut',
            title: 'Yeniden adlandır',
        },
        status: {
            noErrors: 'Hata yok!',
            title: 'Durum',
        },
        upload: {
            ifExist: 'Eğer dosya mevcutsa:',
            noSelected: 'Hiç bir dosya seçilmedi!',
            overwrite: 'Üzerine yaz!',
            selected: 'Seçilen:',
            size: 'Boyut:',
            skip: 'Atla',
            title: 'Dosyaları yükle',
        },
        editor: {
            title: 'Editör',
        },
        audioPlayer: {
            title: 'Ses oynatıcı',
        },
        videoPlayer: {
            title: 'Video oynatıcı',
        },
        zip: {
            title: 'Arşiv yarat',
            fieldName: 'Arşiv adı',
            fieldFeedback: 'Arşiv mevcut!',
        },
        unzip: {
            title: 'Arşivi aç',
            fieldName: 'Klasör adı',
            fieldRadioName: 'Hedef:',
            fieldRadio1: 'Şu anki klasör',
            fieldRadio2: 'Yeni klasör',
            fieldFeedback: 'Klasör mevcut!',
            warning: 'Dikkat! Eğer dosya isimleri aynı olursa, üzerine yazılacak!',
        },
        cropper: {
            title: 'Kırpma',
            apply: 'Uygula',
            reset: 'Sıfırla',
            save: 'Kaydet',
        },
    },
    notifications: {
        cutToClipboard: 'Panoya kesildi!',
        copyToClipboard: 'Panoya kopyalandı!',
    },
    response: {
        noConfig: 'Ayarlar bulunamadı!',
        notFound: 'Bulunamadı!',
        diskNotFound: 'Disk bulunamadı!',
        pathNotFound: 'Yol bulunamadı!',
        diskSelected: 'Disk seçildi!',
        // files
        fileExist: 'Dosya zaten var!',
        fileCreated: 'Dosya yaratıldı!',
        fileUpdated: 'Dosya güncellendi!',
        fileNotFound: 'Dosya bulunamadı!',
        // directories
        dirExist: 'Klasör zaten var!',
        dirCreated: 'Klasör yaratıldı!',
        dirNotFound: 'Klasör bulunamadı',
        // actions
        uploaded: 'Tüm dosyalar yüklendi!',
        notAllUploaded: 'Bazı dosyalar yüklenemedi!',
        delNotFound: 'Bazı öğeler bulunamadı!',
        deleted: 'Silindi!',
        renamed: 'Yeniden adlandırıldı!',
        copied: 'Başarıyla kopyalandı!',
        // zip
        zipError: 'Arşiv yaratılırken hata oluştu!',
        // acl
        aclError: 'Erişim engellendi!',
    },

    clearall:{
        clear_all_selection : 'Tüm seçimi temizle',
        delete_all : 'Seçilen tüm dosyaları gerçekten temizlemek istiyor musunuz?',
    }
};

export default tr;
