@echo off
chcp 65001 >nul
title Youjey Clean Push

REM ===============================
REM  프로젝트 루트 경로 설정
REM ===============================
cd /d D:\newjey

echo ===============================
echo  기존 Git 저장소 삭제 (깨진 ref 포함)
echo ===============================
if exist .git (
    rmdir /s /q .git
    echo .git 폴더 삭제 완료
) else (
    echo .git 폴더 없음
)

echo ===============================
echo  새 Git 저장소 초기화
echo ===============================
git init
git branch -M main
git remote add origin https://github.com/htmlnoob1047/youjey.git

echo ===============================
echo  모든 변경 사항 add
echo ===============================
git add -A

set /p commit_msg="커밋 메시지를 입력하세요 (Enter 시 기본 메시지 사용): "
if "%commit_msg%"=="" set commit_msg="Initial commit with local files"

git commit -m "%commit_msg%"

echo ===============================
echo  강제 push 원격 저장소
echo ===============================
git push -u origin main --force

echo ===============================
echo  완료! 로컬 상태가 GitHub에 안전하게 push 되었습니다.
echo ===============================
pause


