@echo off
echo ================================================
echo  RESTORE SCRIPT - iPay88 Implementation
echo  Power Landmark Project
echo ================================================
echo.

echo [1/6] Restoring Core Library...
copy "backup\ipay88_implementation\ipay88.ts" "src\lib\ipay88.ts" >nul
if %errorlevel% == 0 (
    echo ✅ iPay88 core library restored
) else (
    echo ❌ Failed to restore core library
    goto :error
)

echo [2/6] Restoring API Routes...
copy "backup\ipay88_implementation\api_routes\checkout_route.ts" "src\app\api\checkout\route.ts" >nul
copy "backup\ipay88_implementation\api_routes\callback.ts" "src\app\api\payment\callback\route.ts" >nul
copy "backup\ipay88_implementation\api_routes\response.ts" "src\app\api\payment\response\route.ts" >nul
if %errorlevel% == 0 (
    echo ✅ API routes restored
) else (
    echo ❌ Failed to restore API routes
    goto :error
)

echo [3/6] Restoring Pages & Components...
copy "backup\ipay88_implementation\components_pages\checkout_page.tsx" "src\app\checkout\page.tsx" >nul
copy "backup\ipay88_implementation\components_pages\test_payment_page.tsx" "src\app\payment\test-payment\page.tsx" >nul
if %errorlevel% == 0 (
    echo ✅ Pages and components restored
) else (
    echo ❌ Failed to restore pages and components
    goto :error
)

echo [4/6] Creating environment file...
if not exist ".env.local" (
    echo # iPay88 Configuration>> .env.local
    echo IPAY88_MERCHANT_CODE="ID02189">> .env.local
    echo IPAY88_MERCHANT_KEY="Lqb4Mpq4H7">> .env.local
    echo ✅ Environment variables added to .env.local
) else (
    echo ⚠️  .env.local already exists, please add iPay88 variables manually:
    echo    IPAY88_MERCHANT_CODE="ID02189"
    echo    IPAY88_MERCHANT_KEY="Lqb4Mpq4H7"
)

echo [5/6] Checking next.config.ts...
findstr /C:"ipay88" "next.config.ts" >nul
if %errorlevel% == 1 (
    echo ⚠️  Please add iPay88 CSP to next.config.ts manually:
    echo    { key: 'Content-Security-Policy', value: "frame-ancestors 'self' *.ipay88.co.id sandbox.ipay88.co.id;" }
) else (
    echo ✅ iPay88 configuration found in next.config.ts
)

echo [6/6] Checking middleware.ts...
findstr /C:"payment/callback" "src\middleware.ts" >nul
if %errorlevel% == 1 (
    echo ⚠️  Please update middleware.ts to skip auth for iPay88 callbacks
) else (
    echo ✅ Middleware configuration found
)

echo.
echo ================================================
echo  ✅ iPay88 RESTORE COMPLETED!
echo ================================================
echo.
echo Next steps:
echo 1. Verify .env.local has iPay88 credentials
echo 2. Check next.config.ts for CSP configuration
echo 3. Verify middleware.ts excludes payment callbacks
echo 4. Test payment flow: npm run dev
echo 5. Visit: http://localhost:3000/checkout
echo.
echo For testing, use amount: 1.00 IDR
echo.
goto :end

:error
echo.
echo ❌ RESTORE FAILED!
echo Please check file paths and permissions.
echo.

:end
pause 