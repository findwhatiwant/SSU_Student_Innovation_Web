const router = {
    show(id) {
        document.getElementById(id).classList.add('active');
    },

    goTo(id) {
        const cur = document.querySelector('.screen.active');
        if (cur) {
            cur.classList.add('exit');
            cur.classList.remove('active');
            setTimeout(() => cur.classList.remove('exit'), 350);
        }
        setTimeout(() => this.show(id), 120);
    },
};

export default router;
