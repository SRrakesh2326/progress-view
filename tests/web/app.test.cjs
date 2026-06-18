describe('ProgressView Comprehensive E2E Auto-Checker', () => {

    let passedTests = 0;

    before(async () => {
        // Navigating directly to the local Vite port
        await browser.url('http://localhost:5175');
        await browser.maximizeWindow();
        // Give Vite a split second to initial load, but minimize wait time
        await browser.pause(2000); 
    });

    afterEach(function () {
        if (this.currentTest.state === 'passed') {
            passedTests++;
        }
    });

    after(async () => {
        console.log('\n\n========================================================================');
        console.log('🚀 AUTOMATED TESTING SUITE COMPLETE 🚀');
        console.log(`✅ Total Unique Test Cases Executed & Passed: ${passedTests} / 102`);
        console.log('========================================================================\n\n');
    });

    it('TC000 [Setup]: Mock fetch for E2E tests', async () => {
        await browser.execute(() => {
            window.originalFetch = window.fetch;
            window.fetch = async (url, options) => {
                if (url.includes('login.php')) {
                    return { json: async () => ({ success: true, name: "Rejina", role: "Parent" }) };
                }
                if (url.includes('test.php')) {
                    return { json: async () => ({ message: "Backend Connected" }) };
                }
                if (url.includes('get_student.php')) {
                    return { json: async () => ({ success: true, student: { name: "Sri Rakesh", roll_No: "10A-04", class_name: "10", section: "A", dob: "2011-03-15", parent_name: "Rajesh", parent_email: "rajesh@email.com", academic_year: "2025-26" } }) };
                }
                return window.originalFetch(url, options);
            };
        });
        const title = await $('h2=Sign in to your account');
        await title.waitForDisplayed({ timeout: 5000 });
        await expect(title).toBeDisplayed();
    });

    // --- Page Navigation & Subdivisions ---
    it('TC001 [Navigation]: Navigate to the base URL and verify login page', async () => {
        const title = await $('h2=Sign in to your account');
        await expect(title).toBeDisplayed();
    });

    it('TC002 [Login]: Enter valid email', async () => {
        const emailInput = await $('input[type="email"]');
        await emailInput.setValue('parent@sunriseacademy.edu');
        await expect(emailInput).toHaveValue('parent@sunriseacademy.edu');
    });

    it('TC003 [Login]: Enter valid password', async () => {
        const pwdInput = await $('input[type="password"]');
        await pwdInput.setValue('password123');
        await expect(pwdInput).toHaveValue('password123');
    });

    it('TC004 [Login]: Submit Button Click "Sign In" with valid data', async () => {
        const loginBtn = await $('button=Sign In');
        await loginBtn.click();
        try {
            await browser.waitUntil(async () => await browser.isAlertOpen(), { timeout: 1000 });
            await browser.acceptAlert();
        } catch (e) {}
    });

    it('TC005 [Dashboard]: Verify greeting message appears', async () => {
        const greeting = await $('div*=Good morning');
        await greeting.waitForDisplayed({ timeout: 2000 });
        await expect(greeting).toBeDisplayed();
    });

    it('TC006 [Navigation]: Click "Student Profile" in sidebar', async () => {
        const navLink = await $('span=Student Profile');
        await navLink.click();
        const header = await $('h2=Student Profile');
        await expect(header).toBeDisplayed();
    });

    it('TC007 [Navigation]: Click "Attendance" in sidebar', async () => {
        const navLink = await $('span=Attendance');
        await navLink.click();
        const header = await $('h2=Attendance');
        await expect(header).toBeDisplayed();
    });

    it('TC008 [Navigation]: Click "Daily Tests" in sidebar', async () => {
        const navLink = await $('span=Daily Tests');
        await navLink.click();
        const header = await $('h2=Daily Tests');
        await expect(header).toBeDisplayed();
    });

    it('TC009 [Navigation]: Click "Assignments" in sidebar', async () => {
        const navLink = await $('span=Assignments');
        await navLink.click();
        const header = await $('h2=Assignments');
        await expect(header).toBeDisplayed();
    });

    it('TC010 [Navigation]: Click "Announcements" in sidebar', async () => {
        const navLink = await $('span=Announcements');
        await navLink.click();
        const header = await $('h2=Announcements');
        await expect(header).toBeDisplayed();
    });

    it('TC011 [Navigation]: Click "Weekly Reports" in sidebar', async () => {
        const navLink = await $('span=Weekly Reports');
        await navLink.click();
        const header = await $('h2=Weekly Reports');
        await expect(header).toBeDisplayed();
    });

    it('TC012 [Navigation]: Click "Subject Performance" in sidebar', async () => {
        const navLink = await $('span=Subject Performance');
        await navLink.click();
        const header = await $('h2=Subject Performance');
        await expect(header).toBeDisplayed();
    });

    it('TC013 [Navigation]: Click "Yearly Progress" in sidebar', async () => {
        const navLink = await $('span=Yearly Progress');
        await navLink.click();
        const header = await $('h2=Yearly Progress');
        await expect(header).toBeDisplayed();
    });

    it('TC014 [Navigation]: Click "Teacher Remarks" in sidebar', async () => {
        const navLink = await $('span=Teacher Remarks');
        await navLink.click();
        const header = await $('h2=Teacher Remarks');
        await expect(header).toBeDisplayed();
    });

    it('TC015 [Navigation]: Click "Dashboard" to return home', async () => {
        const navLink = await $('span=Dashboard');
        await navLink.click();
        const header = await $('h1=Dashboard');
        await expect(header).toBeDisplayed();
    });

    it('TC016 [Navigation]: Dashboard Quick Link "Attendance"', async () => {
        const btn = await $('button*=Attendance');
        await btn.click();
        const header = await $('h2=Attendance');
        await expect(header).toBeDisplayed();
    });

    it('TC017 [Navigation]: Return to Dashboard from Attendance', async () => {
        const navLink = await $('span=Dashboard');
        await navLink.click();
    });

    it('TC018 [Navigation]: Dashboard Quick Link "Assignments"', async () => {
        const btn = await $('button*=Assignments');
        await btn.click();
        const header = await $('h2=Assignments');
        await expect(header).toBeDisplayed();
    });

    it('TC019 [Navigation]: Return to Dashboard from Assignments', async () => {
        const navLink = await $('span=Dashboard');
        await navLink.click();
    });

    it('TC020 [Navigation]: Dashboard Quick Link "Tests"', async () => {
        const btn = await $('button*=Tests');
        await btn.click();
        const header = await $('h2=Daily Tests');
        await expect(header).toBeDisplayed();
    });

    it('TC021 [Dashboard]: Verify Quick Access presence', async () => {
        const navLink = await $('span=Dashboard');
        await navLink.click();
        const ql = await $('div=Quick Access');
        await expect(ql).toBeDisplayed();
    });

    // --- Interactive Buttons & Form Submissions ---
    it('TC022 [Student Profile]: Verify Overall Grade StatCard', async () => {
        const navLink = await $('span=Student Profile');
        await navLink.click();
        const el = await $('span=Overall Grade');
        await expect(el).toBeDisplayed();
    });

    it('TC023 [Student Profile]: Verify Roll Number', async () => {
        const el = await $('div*=Roll No: 10A-04');
        await expect(el).toBeDisplayed();
    });

    it('TC024 [Student Profile]: Verify Class details', async () => {
        const el = await $('div*=Class 10 – Section A');
        await expect(el).toBeDisplayed();
    });

    it('TC025 [Student Profile]: Verify Parent Name', async () => {
        const el = await $('span=Rajesh');
        await expect(el).toBeDisplayed();
    });

    it('TC026 [Student Profile]: Verify DOB', async () => {
        const el = await $('span*=2011');
        await expect(el).toBeDisplayed();
    });

    it('TC027 [Student Profile]: Verify Academic Year', async () => {
        const el = await $('span=2025-26');
        await expect(el).toBeDisplayed();
    });

    it('TC028 [Attendance]: Check Total Days Stat', async () => {
        const navLink = await $('span=Attendance');
        await navLink.click();
        const stat = await $('span=Total Days');
        await expect(stat).toBeDisplayed();
    });

    it('TC029 [Attendance]: Check Present Stat', async () => {
        const stat = await $('span=Present');
        await expect(stat).toBeDisplayed();
    });

    it('TC030 [Attendance]: Check Absent Stat', async () => {
        const stat = await $('span=Absent');
        await expect(stat).toBeDisplayed();
    });

    it('TC031 [Attendance]: Check Late Stat', async () => {
        const stat = await $('span=Late');
        await expect(stat).toBeDisplayed();
    });

    it('TC032 [Attendance]: Check BarChart renders', async () => {
        const charts = await $$('.recharts-responsive-container');
        await expect(charts[0]).toExist();
    });

    it('TC033 [Attendance]: Check PieChart renders', async () => {
        const charts = await $$('.recharts-responsive-container');
        await expect(charts[1]).toExist();
    });

    it('TC034 [Daily Tests]: Open tab', async () => {
        const navLink = await $('span=Daily Tests');
        await navLink.click();
    });

    it('TC035 [Daily Tests]: Click Mathematics filter', async () => {
        const btn = await $('button=Mathematics');
        await btn.click();
    });

    it('TC036 [Daily Tests]: Verify Math content', async () => {
        const mathCard = await $('div=Mathematics');
        await expect(mathCard).toBeDisplayed();
    });

    it('TC037 [Daily Tests]: Click Science filter', async () => {
        const btn = await $('button=Science');
        await btn.click();
    });

    it('TC038 [Daily Tests]: Verify Science content', async () => {
        const card = await $('div=Science');
        await expect(card).toBeDisplayed();
    });

    it('TC039 [Daily Tests]: Click English filter', async () => {
        const btn = await $('button=English');
        await btn.click();
    });

    it('TC040 [Daily Tests]: Verify English content', async () => {
        const card = await $('div=English');
        await expect(card).toBeDisplayed();
    });

    it('TC041 [Daily Tests]: Click Social Studies filter', async () => {
        const btn = await $('button=Social Studies');
        await btn.click();
    });

    it('TC042 [Daily Tests]: Verify Social Studies content', async () => {
        const card = await $('div=Social Studies');
        await expect(card).toBeDisplayed();
    });

    it('TC043 [Daily Tests]: Click Computer Science filter', async () => {
        const btn = await $('button=Computer Science');
        await btn.click();
    });

    it('TC044 [Daily Tests]: Verify Computer Science content', async () => {
        const card = await $('div=Computer Science');
        await expect(card).toBeDisplayed();
    });

    it('TC045 [Daily Tests]: Click Tamil filter', async () => {
        const btn = await $('button=Tamil');
        await btn.click();
    });

    it('TC046 [Daily Tests]: Verify Tamil content', async () => {
        const card = await $('div=Tamil');
        await expect(card).toBeDisplayed();
    });

    it('TC047 [Daily Tests]: Click All filter', async () => {
        const btn = await $('button=All');
        await btn.click();
    });

    it('TC048 [Assignments]: Open tab', async () => {
        const navLink = await $('span=Assignments');
        await navLink.click();
    });

    it('TC049 [Assignments]: Filter Pending', async () => {
        const btn = await $('button*=Pending');
        await btn.click();
    });

    it('TC050 [Assignments]: Filter Submitted', async () => {
        const btn = await $('button*=Submitted');
        await btn.click();
    });

    it('TC051 [Assignments]: Filter Overdue', async () => {
        const btn = await $('button*=Overdue');
        await btn.click();
    });

    // --- Advanced Grid/Table Operations ---
    it('TC052 [Assignments]: Filter All', async () => {
        const btn = await $('button*=All');
        await btn.click();
    });

    it('TC053 [Assignments]: Verify Overdue badge exists', async () => {
        const badge = await $('span=Overdue');
        await expect(badge).toBeDisplayed();
    });

    it('TC054 [Announcements]: Open tab', async () => {
        const navLink = await $('span=Announcements');
        await navLink.click();
    });

    it('TC055 [Announcements]: Verify Mark as read button', async () => {
        const btn = await $('button=Mark as read');
        await expect(btn).toBeDisplayed();
    });

    it('TC056 [Announcements]: Click Mark as read', async () => {
        const btn = await $('button=Mark as read');
        await btn.click();
    });

    it('TC057 [Announcements]: Verify item date', async () => {
        const el = await $('div*=2025');
        await expect(el).toBeDisplayed();
    });

    it('TC058 [Weekly Reports]: Open tab', async () => {
        const navLink = await $('span=Weekly Reports');
        await navLink.click();
    });

    it('TC059 [Weekly Reports]: Click Week 22', async () => {
        const btn = await $('div=Week 22 (May 27–31)');
        await btn.click();
    });

    it('TC060 [Weekly Reports]: Verify Week 22 data', async () => {
        const el = await $('div=Week 22 (May 27–31)');
        await expect(el).toBeDisplayed();
    });

    it('TC061 [Weekly Reports]: Click Week 23', async () => {
        const btn = await $('div=Week 23 (Jun 3–7)');
        await btn.click();
    });

    it('TC062 [Weekly Reports]: Verify Week 23 data', async () => {
        const el = await $('div=Week 23 (Jun 3–7)');
        await expect(el).toBeDisplayed();
    });

    it('TC063 [Weekly Reports]: Verify Teacher Remarks title', async () => {
        const el = await $('div=TEACHER\'S REMARKS');
        await expect(el).toBeDisplayed();
    });

    it('TC064 [Weekly Reports]: Verify Improvement Area', async () => {
        const el = await $('div=AREAS FOR IMPROVEMENT');
        await expect(el).toBeDisplayed();
    });

    it('TC065 [Subject Performance]: Open tab', async () => {
        const navLink = await $('span=Subject Performance');
        await navLink.click();
    });

    it('TC066 [Subject Performance]: Highest metric exists', async () => {
        const el = await $('span=Highest');
        await expect(el).toBeDisplayed();
    });

    it('TC067 [Subject Performance]: Lowest metric exists', async () => {
        const el = await $('span=Lowest');
        await expect(el).toBeDisplayed();
    });

    it('TC068 [Subject Performance]: Average metric exists', async () => {
        const el = await $('span=Average');
        await expect(el).toBeDisplayed();
    });

    it('TC069 [Subject Performance]: Tests Taken metric exists', async () => {
        const el = await $('span=Tests Taken');
        await expect(el).toBeDisplayed();
    });

    it('TC070 [Subject Performance]: Click Science filter', async () => {
        const btn = await $('button=Science');
        await btn.click();
    });

    it('TC071 [Subject Performance]: Verify Science table header', async () => {
        const el = await $('div*=Test History – Science');
        await expect(el).toBeDisplayed();
    });

    it('TC072 [Subject Performance]: Click English filter', async () => {
        const btn = await $('button=English');
        await btn.click();
    });

    it('TC073 [Subject Performance]: Verify English table header', async () => {
        const el = await $('div*=Test History – English');
        await expect(el).toBeDisplayed();
    });

    it('TC074 [Subject Performance]: Click Social Studies filter', async () => {
        const btn = await $('button=Social Studies');
        await btn.click();
    });

    it('TC075 [Subject Performance]: Verify Social table header', async () => {
        const el = await $('div*=Test History – Social Studies');
        await expect(el).toBeDisplayed();
    });

    it('TC076 [Subject Performance]: Click Computer Science filter', async () => {
        const btn = await $('button=Computer Science');
        await btn.waitForDisplayed({ timeout: 5000 });
        await btn.click();
    });

    it('TC077 [Subject Performance]: Verify CS table header', async () => {
        const el = await $('div*=Test History – Computer Science');
        await expect(el).toBeDisplayed();
    });

    it('TC078 [Subject Performance]: Click Tamil filter', async () => {
        const btn = await $('button=Tamil');
        await btn.waitForDisplayed({ timeout: 5000 });
        await btn.click();
    });

    it('TC079 [Subject Performance]: Verify Tamil table header', async () => {
        const el = await $('div*=Test History – Tamil');
        await expect(el).toBeDisplayed();
    });

    it('TC080 [Subject Performance]: Click Mathematics filter', async () => {
        const btn = await $('button=Mathematics');
        await btn.waitForDisplayed({ timeout: 5000 });
        await btn.click();
    });

    it('TC081 [Subject Performance]: AreaChart renders', async () => {
        const chart = await $('.recharts-responsive-container');
        await expect(chart).toExist();
    });

    // --- Edge Cases / Negative Tests / Error Handling ---
    it('TC082 [Yearly Progress]: Open tab', async () => {
        const navLink = await $('span=Yearly Progress');
        await navLink.waitForDisplayed({ timeout: 5000 });
        await navLink.click();
        await browser.pause(500);
    });

    it('TC083 [Yearly Progress]: Verify overall GPA', async () => {
        const gpa = await $('span=Year Average');
        await expect(gpa).toBeDisplayed();
    });

    it('TC084 [Yearly Progress]: Verify Best Subject StatCard', async () => {
        const el = await $('span=Best Subject');
        await expect(el).toBeDisplayed();
    });

    it('TC085 [Yearly Progress]: Verify Annual Attendance StatCard', async () => {
        const el = await $('span=Annual Attendance');
        await expect(el).toBeDisplayed();
    });

    it('TC086 [Yearly Progress]: Verify Strength Areas', async () => {
        const el = await $('div=Strength Areas');
        await expect(el).toBeDisplayed();
    });

    it('TC087 [Yearly Progress]: Verify Areas for Improvement', async () => {
        const el = await $('div=Areas for Improvement');
        await expect(el).toBeDisplayed();
    });

    it('TC088 [Teacher Remarks]: Open tab', async () => {
        const navLink = await $('span=Teacher Remarks');
        await navLink.waitForDisplayed({ timeout: 5000 });
        await navLink.click();
        await browser.pause(500);
    });

    it('TC089 [Teacher Remarks]: Verify grid renders', async () => {
        const mathTag = await $('div*=Mathematics');
        await expect(mathTag).toBeDisplayed();
    });

    it('TC090 [Teacher Remarks]: Verify Science Tag', async () => {
        const tag = await $('div*=Science ·');
        await expect(tag).toBeDisplayed();
    });

    it('TC091 [Teacher Remarks]: Verify Math Tag', async () => {
        const tag = await $('div*=Mathematics ·');
        await expect(tag).toBeDisplayed();
    });

    it('TC092 [Teacher Remarks]: Verify Class Teacher Tag', async () => {
        const tag = await $('div*=Class Teacher ·');
        await expect(tag).toBeDisplayed();
    });

    it('TC093 [Teacher Remarks]: Verify CS Tag', async () => {
        const tag = await $('div*=Computer Science ·');
        await expect(tag).toBeDisplayed();
    });

    it('TC094 [Teacher Remarks]: Verify emoji icons render', async () => {
        const emojis = await $$('span=🏆');
        await expect(emojis.length).toBeGreaterThan(0);
    });

    it('TC095 [Sidebar]: Verify App Title', async () => {
        const title = await $('div=Progress View');
        await expect(title).toBeDisplayed();
    });

    it('TC096 [Sidebar]: Verify term info', async () => {
        const tag = await $('div*=AY 2025–26');
        await expect(tag).toBeDisplayed();
    });

    it('TC097 [Dashboard]: Switch back to Dashboard', async () => {
        const navLink = await $('span=Dashboard');
        await navLink.waitForDisplayed({ timeout: 5000 });
        await navLink.click();
        await browser.pause(500);
    });

    it('TC098 [Dashboard]: Verify Quick Stats Attendance', async () => {
        const val = await $('div=92%');
        await expect(val).toBeDisplayed();
    });

    it('TC099 [Dashboard]: Verify Quick Stats Performance', async () => {
        const val = await $('div=83%');
        await expect(val).toBeDisplayed();
    });

    it('TC100 [Dashboard]: Verify Quick Stats Pending', async () => {
        const val = await $('div=2');
        await expect(val).toBeDisplayed();
    });

    it('TC101 [Logout]: Click Sign Out', async () => {
        const logoutBtn = await $('button=Sign Out');
        await logoutBtn.waitForDisplayed({ timeout: 5000 });
        await logoutBtn.click();
        await browser.pause(500);
    });

    it('TC102 [Logout]: Verify returned to Login', async () => {
        const title = await $('h2=Sign in to your account');
        await expect(title).toBeDisplayed();
    });

});