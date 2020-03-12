const pascal = (s: string) => {
    const n = s.replace(/(\s+\w)/g, w => w.trim().toUpperCase());
    return n[0].toUpperCase() + n.substr(1);
};

export default pascal;
