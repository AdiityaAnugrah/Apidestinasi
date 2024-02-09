const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors"); //Berfungsi untuk dapat menampilkan di beda port
const app = express();
const bcrypt = require("bcrypt");
const port = 8082;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apidestinasi",
});
connection.connect();

app.get("/", (req, res) => {
  res.send("Hallo Gan");
});

//Memanggil Data Wisata
app.get("/wisata", (req, res) => {
  connection.query("SELECT * FROM wisata", (error, results) => {
    if (error) return error;
    const resultFilter = results.map((a) => {
      const galeri = JSON.parse(a.galeri);
      return {
        id: a.id,
        nama: a.nama,
        deskripsi: a.deskripsi,
        waktu: a.waktu,
        fasilitas: a.fasilitas,
        lokasi: a.lokasi,
        foto_display: "http://192.168.1.13:8082/foto/" + galeri[0],
        maps: a.maps,
      };
    });
    res.json({
      pesan: "OK",
      data: resultFilter,
    });
  });
});

//Memanggil Dat Wisata Detail
app.get("/wisata/:id", (req, res) => {
  connection.query(
    "SELECT * FROM wisata WHERE id=" + req.params.id,
    (error, results) => {
      if (error) return error;
      const resultFilter = results.map((a) => {
        const galeri = JSON.parse(a.galeri);
        return {
          id: a.id,
          nama: a.nama,
          deskripsi: a.deskripsi,
          waktu: a.waktu,
          fasilitas: a.fasilitas,
          lokasi: a.lokasi,
          foto_display: "http://192.168.1.13:8082/foto/" + galeri[0],
          maps: a.maps,
          foto: galeri.map((foto, ind) => {
            return "http://192.168.1.13:8082/foto/" + galeri[ind];
          }),
        };
      });
      res.json({
        pesan: "OK",
        data: resultFilter,
      });
    }
  );
});

//Memanggil Data Hotel
app.get("/hotel", (req, res) => {
  connection.query("SELECT * FROM hotel", (error, results) => {
    if (error) return error;
    const resultFilter = results.map((a) => {
      const galeri = JSON.parse(a.galeri);
      return {
        id: a.id,
        nama: a.nama,
        deskripsi: a.deskripsi,
        waktu: a.waktu,
        fasilitas: a.fasilitas,
        lokasi: a.lokasi,
        foto_display: "http://192.168.1.13:8082/foto/" + galeri[0],
        maps: a.maps,
      };
    });
    res.json({
      pesan: "OK",
      data: resultFilter,
    });
  });
});

//Memanggil Dat Hotel Detail
app.get("/hotel/:id", (req, res) => {
  connection.query(
    "SELECT * FROM hotel WHERE id=" + req.params.id,
    (error, results) => {
      if (error) return error;
      const resultFilter = results.map((a) => {
        const galeri = JSON.parse(a.galeri);
        return {
          id: a.id,
          nama: a.nama,
          deskripsi: a.deskripsi,
          waktu: a.waktu,
          fasilitas: a.fasilitas,
          lokasi: a.lokasi,
          maps: a.maps,
          foto_display: "http://192.168.1.13:8082/foto/" + galeri[0],
          foto: galeri.map((foto, ind) => {
            return "http://192.168.1.13:8082/foto/" + galeri[ind];
          }),
        };
      });
      res.json({
        pesan: "OK",
        data: resultFilter,
      });
    }
  );
});

//Memanggil Data Wisata
app.get("/restoran", (req, res) => {
  connection.query("SELECT * FROM restoran", (error, results) => {
    if (error) return error;
    const resultFilter = results.map((a) => {
      const galeri = JSON.parse(a.galeri);
      return {
        id: a.id,
        nama: a.nama,
        deskripsi: a.deskripsi,
        waktu: a.waktu,
        fasilitas: a.fasilitas,
        lokasi: a.lokasi,
        maps: a.maps,
        foto_display: "http://192.168.1.13:8082/foto/" + galeri[0],
      };
    });
    res.json({
      pesan: "OK",
      data: resultFilter,
    });
  });
});

//Memanggil Dat Restoran Detail
app.get("/restoran/:id", (req, res) => {
  connection.query(
    "SELECT * FROM restoran WHERE id=" + req.params.id,
    (error, results) => {
      if (error) return error;
      const resultFilter = results.map((a) => {
        const galeri = JSON.parse(a.galeri);
        return {
          id: a.id,
          nama: a.nama,
          deskripsi: a.deskripsi,
          waktu: a.waktu,
          fasilitas: a.fasilitas,
          lokasi: a.lokasi,
          maps: a.maps,
          foto_display: "http://192.168.1.13:8082/foto/" + galeri[0],
          foto: galeri.map((foto, ind) => {
            return "http://192.168.1.13:8082/foto/" + galeri[ind];
          }),
        };
      });
      res.json({
        pesan: "OK",
        data: resultFilter,
      });
    }
  );
});

//Domain/foto/(id)
app.get("/foto/:id", (req, res) => {
  connection.query(
    "SELECT * FROM galeri WHERE id=" + req.params.id,
    (error, results) => {
      if (error) return error;
      const resultFilter = results[0].foto;
      res.setHeader("Content-Type", "image/jpeg");
      res.send(resultFilter);
    }
  );
});

//Menambahkan Data Wisata
app.post("/wisata", (req, res) => {
  const body = req.body;
  res.json(body);
  // connection.query(
  //   "INSERT INTO wisata ('id','nama','deskripsi','waktu','fasilitas','galeri','lokasi') VALUES ('" +
  //     req.params.id,
  //   (error, results) => {
  //     if (error) return error;
  //     const resultFilter = results[0].foto;
  //     res.setHeader("Content-Type", "image/jpeg");
  //     res.send(resultFilter);
  //   }
  // );
});

// Daftar/Tambah user
app.post("/user", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt); // passwordnya jadi terenkripsi

    // data yg mau dimasukkan ke database
    const formData = {
      email: req.body.email,
      password: hashPassword,
    };

    connection.query("INSERT INTO user SET ?", formData, (error, result) => {
      if (error) throw error; // tangkap dan lempar error
      return res.json({
        pesan: "OK",
        message: "Insert Data Successfully",
        data: result[0],
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      pesan: "Error",
      message: "Internal Server Error",
    });
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const formData = {
      email: req.body.email,
    };
    connection.query(
      "SELECT * FROM user WHERE ?",
      formData,
      (error, result) => {
        if (error) throw error; // tangkap dan lempar error

        if (result.length <= 0) {
          return res.status(404).json({
            pesan: "OK",
            message: "Email tidak terdaftar",
          });
        }
        const passwordDatabase = result[0].password;
        if (!bcrypt.compareSync(req.body.password, passwordDatabase)) {
          // bcrypt compare utk membandingkan password dari body dengan password database yg sudah dienkripsi
          return res.json({
            pesan: "OK",
            message: "Password salah",
          });
        }
        return res.json({
          pesan: "OK",
          message: "Login berhasil",
          dataUser: result[0],
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      pesan: "Error",
      message: "Internal Server Error",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
