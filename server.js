const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());

// == konfigurasi dasar ==
const PORT = 3000;
const JWT_SECRET = "rahasia_agnes_2025";

// == menyimpan data di Array ==
let users = [
  {
    id: 1,
    name: "Agnes Elson",
    username: "agnes",
    passwordHash: bcrypt.hashSync("siswa123", 8),
    kelas: "XI-RPL-4",
    nis: "1101",
  },
];
let attendances = [];
let nextUserId = 2;
let nextAttendanceId = 1;

// == middleware : verifikasi token ==
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Token diperlukan" });
  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token anda tidak valid" });
  }
}

// ==LOGIN==
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Username salah" });
  if (!bcrypt.compareSync(password, user.passwordHash))
    return res.status(401).json({ message: "Huhu Password Salah" });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "24h",
  });
  res.json({ message: "Yeay Login Sukses", token });
});

// == menambahkan siswa ==
app.post("/api/users", verifyToken, (req, res) => {
  const { name, username, password, kelas, nis } = req.body;
  const newUser = {
    id: nextUserId++,
    name,
    username,
    passwordHash: bcrypt.hashSync(password, 8),
    kelas,
    nis,
  };
  users.push(newUser);
  res
    .status(201)
    .json({ message: "Siswa berhasil ditambahkan", user: newUser });
});

// == update siswa ==
app.put("/api/users/:id", verifyToken, (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: "Siswa tidak ditemukan" });
  const { name, password, kelas, nis } = req.body;
  if (name) user.name = name;
  if (password) user.passwordHash = bcrypt.hashSync(password, 8);
  if (kelas) user.kelas = kelas;
  if (nis) user.nis = nis;
  res.json({ message: "Data siswa diupdate", user });
});

// == menampilkan siswa ==
app.get("/api/users/:id", verifyToken, (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: "Siswa tidak ditemukan" });
  res.json(user);
});

// == catat presensi ==
app.post("/api/attendance", verifyToken, (req, res) => {
  const { userId, status, note } = req.body;
  const date = new Date().toISOString().slice(0, 10);

  const attendance = { id: nextAttendanceId++, userId, status, note, date };
  attendances.push(attendance);

  res.status(201).json({ message: "Presensi dicatat", attendance });
});

// == lihat riwayat presensi ==
app.get("/api/attendance/history/:userId", verifyToken, (req, res) => {
  const history = attendances.filter((a) => a.userId == req.params.userId);
  res.json({ history });
});

// == analisis kehadiran siswa ==
app.get("/api/attendance/analysis/:userId", verifyToken, (req, res) => {
  const { month } = req.query; // contoh ?month=2025-11
  const userId = req.params.userId;

  const userAttendances = attendances.filter(
    (a) => a.userId == userId && (!month || a.date.startsWith(month))
  );

  if (userAttendances.length === 0)
    return res.json({
      message: "Tidak ada data presensi untuk user/bulan ini.",
    });

  const summary = { hadir: 0, sakit: 0, izin: 0, alpha: 0 };
  userAttendances.forEach((a) => {
    const key = a.status.toLowerCase();
    if (summary[key] !== undefined) summary[key]++;
  });

  const total = userAttendances.length;
  const persentaseHadir = ((summary.hadir / total) * 100).toFixed(2);

  res.json({
    userId,
    month: month || "Semua bulan",
    totalPresensi: total,
    rekap: summary,
    persentaseHadir: `${persentaseHadir}%`,
  });
});

// == analisis kehadiran per kelas ==
app.get("/api/attendance/kelas/:kelas", verifyToken, (req, res) => {
  const { kelas } = req.params;
  const siswaKelas = users.filter((u) => u.kelas === kelas);

  if (siswaKelas.length === 0)
    return res.status(404).json({ message: "Tidak ada siswa di kelas ini" });

  const hasil = siswaKelas.map((u) => {
    const dataUser = attendances.filter((a) => a.userId === u.id);
    const rekap = { hadir: 0, sakit: 0, izin: 0, alpha: 0 };
    dataUser.forEach((a) => {
      const s = a.status.toLowerCase();
      if (rekap[s] !== undefined) rekap[s]++;
    });
    const total = dataUser.length;
    const persentase = total
      ? ((rekap.hadir / total) * 100).toFixed(2)
      : "0.00";
    return {
      nama: u.name,
      nis: u.nis,
      kelas: u.kelas,
      rekap,
      persentaseHadir: `${persentase}%`,
    };
  });

  res.json({ kelas, hasil });
});

app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
