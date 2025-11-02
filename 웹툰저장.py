import os
import time
import requests
from urllib.parse import urlparse
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import threading

save_folder = ""
MIN_FILE_SIZE = 2048  # 2KB 미만 파일은 무시

def choose_folder():
    global save_folder
    folder = filedialog.askdirectory()
    if folder:
        save_folder = folder
        folder_label.config(text=f"상위폴더: {save_folder}")

def scroll_and_load_all_images(driver):
    imgs = driver.find_elements(By.CSS_SELECTOR, "#toon_content_imgs img")
    last_count = -1
    while True:
        for img in imgs:
            driver.execute_script("arguments[0].scrollIntoView(true);", img)
        time.sleep(0.5)
        imgs = driver.find_elements(By.CSS_SELECTOR, "#toon_content_imgs img")
        if len(imgs) == last_count:
            break
        last_count = len(imgs)
    time.sleep(2)

def get_image_urls_safe(driver):
    scroll_and_load_all_images(driver)
    imgs = driver.find_elements(By.CSS_SELECTOR, "#toon_content_imgs img")
    urls = []
    for img in imgs:
        src = (img.get_attribute("src") or img.get_attribute("data-original") 
               or img.get_attribute("o_src") or img.get_attribute("data-vd8be80e4ed") 
               or img.get_attribute("data-src"))
        if src and "loading.svg" not in src.lower():  # 로딩 이미지 제외
            if src.startswith("//"):
                src = "https:" + src
            if src.startswith("http") and src not in urls:
                urls.append(src)
    return urls

def download_images(link_url, folder_path, update_progress_func):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--log-level=3")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
    driver = webdriver.Chrome(options=options)
    count = 0
    try:
        driver.get(link_url)
        urls = get_image_urls_safe(driver)
        if not urls:
            print(f"[알림] {link_url}에서 이미지가 없습니다.")
            driver.quit()
            return 0

        os.makedirs(folder_path, exist_ok=True)

        # Selenium 쿠키 가져오기
        session = requests.Session()
        for cookie in driver.get_cookies():
            session.cookies.set(cookie['name'], cookie['value'])

        for i, img_url in enumerate(urls, start=1):
            ext = os.path.splitext(urlparse(img_url).path)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
                ext = ".jpg"
            filename = os.path.join(folder_path, f"{i}{ext}")

            # 이미 다운로드 된 정상 파일 건너뛰기
            if os.path.exists(filename) and os.path.getsize(filename) >= MIN_FILE_SIZE:
                count += 1
                progress = int((i / len(urls)) * 100)
                root.after(0, update_progress_func, progress)
                continue

            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Referer": link_url
            }

            while True:  # 실패 시 무한 재시도
                try:
                    res = session.get(img_url, headers=headers, stream=True, timeout=15)
                    if res.status_code == 200:
                        with open(filename, "wb") as f:
                            for chunk in res.iter_content(1024*1024):
                                if chunk:
                                    f.write(chunk)
                        # 파일 크기 확인
                        if os.path.getsize(filename) < MIN_FILE_SIZE:
                            print(f"[무시] {img_url} 파일 너무 작음, 건너뜀")
                            os.remove(filename)
                            break
                        count += 1
                        break
                    else:
                        print(f"[재시도] {img_url} 상태코드: {res.status_code}")
                        time.sleep(2)
                except Exception as e:
                    print(f"[재시도] {img_url} 오류: {e}")
                    time.sleep(2)

            progress = int((i / len(urls)) * 100)
            root.after(0, update_progress_func, progress)
            time.sleep(0.5)

        driver.quit()
        return count
    except Exception as e:
        driver.quit()
        print(f"[오류] {link_url}: {e}")
        return 0

def download_all(update_progress_func):
    main_url = url_entry.get()
    if not main_url:
        messagebox.showerror("오류", "메인 페이지 URL을 입력해주세요.")
        return
    if not save_folder:
        messagebox.showerror("오류", "상위폴더를 선택해주세요.")
        return

    try:
        start_card = int(start_entry.get())
        if start_card < 1:
            start_card = 1
    except:
        start_card = 1

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--log-level=3")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
    driver = webdriver.Chrome(options=options)
    try:
        driver.get(main_url)
        cards = driver.find_elements(By.CSS_SELECTOR, ".mt-2 > .card")
        if not cards:
            messagebox.showinfo("알림", "메인 페이지에서 다운로드할 카드가 없습니다.")
            driver.quit()
            return

        cards = cards[::-1]
        if start_card > len(cards):
            messagebox.showinfo("알림", f"시작 카드 번호가 총 카드 수({len(cards)})보다 큽니다.")
            driver.quit()
            return
        cards_to_download = cards[start_card-1:]

        total_count = 0
        for idx, card in enumerate(cards_to_download, start=start_card):
            folder_name = f"c{idx}"
            folder_path = os.path.join(save_folder, folder_name)
            a_tag = card.find_element(By.TAG_NAME, "a")
            link_url = a_tag.get_attribute("href")
            if not link_url:
                continue
            print(f"\n[진행중] {link_url} → {folder_name}")
            count = download_images(link_url, folder_path, update_progress_func)
            total_count += count

        driver.quit()
        messagebox.showinfo("완료", f"총 {total_count}개의 이미지를 다운로드했습니다!\n상위폴더: {save_folder}")

    except Exception as e:
        driver.quit()
        messagebox.showerror("오류", str(e))

def start_download_thread():
    threading.Thread(target=download_all, args=(progress_var.set,), daemon=True).start()

# GUI 생성
root = tk.Tk()
root.title("웹툰 이미지 다운로드 (loading.svg 무시 + 안전판)")

tk.Label(root, text="메인 페이지 URL:").pack()
url_entry = tk.Entry(root, width=50)
url_entry.pack(pady=5)

folder_btn = tk.Button(root, text="상위폴더 선택", command=choose_folder)
folder_btn.pack(pady=5)

folder_label = tk.Label(root, text="상위폴더: 선택 안됨")
folder_label.pack(pady=5)

tk.Label(root, text="시작 카드 번호 (c1, c2, ...):").pack()
start_entry = tk.Entry(root, width=10)
start_entry.insert(0, "1")
start_entry.pack(pady=5)

progress_var = tk.IntVar()
progress_bar = ttk.Progressbar(root, length=400, variable=progress_var, maximum=100)
progress_bar.pack(pady=10)

download_btn = tk.Button(root, text="다운로드 시작", command=start_download_thread)
download_btn.pack(pady=10)

root.mainloop()