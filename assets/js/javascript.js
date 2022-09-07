document.querySelector(".humburger").addEventListener("click", () => {
    document.querySelector("nav ul").classList.toggle("show");
  });
  
  const buku = [];
  const RENDER_EVENT = "render-buku";
  
  const buatId = () => {
    return +new Date();
  };
  
  const buatBukuObjek = (id, title, author, year, isCompleted) => {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  };
  
  const cariBuku = (bukuId) => {
    for (const bukuItem of buku) {
      if (bukuItem.id === bukuId) {
        return bukuItem;
      }
    }
    return null;
  };
  
  const cariBukuIndex = (bukuId) => {
    for (const index in buku) {
      if (buku[index].id === bukuId) {
        return index;
      }
    }
    return -1;
  };

  const buatBuku = (bukuObjek) => {
    const { id, title, author, year, isCompleted } = bukuObjek;
  
    const textTitle = document.createElement("h3");
    textTitle.classList.add("namaBuku");
    textTitle.innerText = title;
  
    const textAuthor = document.createElement("p");
    textAuthor.innerText = author + ", " + year;
  
    const pembungkus = document.createElement("div");
    pembungkus.classList.add("pembungkus");
    pembungkus.append(textTitle, textAuthor);
  
    const pembungkus2 = document.createElement("div");
  
    const cardBuku = document.createElement("div");
    cardBuku.classList.add("card-buku");
    cardBuku.append(pembungkus, pembungkus2);
    cardBuku.setAttribute("id", `buku-${id}`);
  
    if (isCompleted) {
      const selesaiBuku = document.createElement("button");
      selesaiBuku.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
      selesaiBuku.classList.add("button-baca");
      selesaiBuku.addEventListener("click", () => {
        kembaliUntukBuku(id);
      });
  
      const hapusBuku = document.createElement("button");
      hapusBuku.innerHTML = `<i class="fa-solid fa-circle-minus"></i>`;
      hapusBuku.classList.add("button-hapus");
      hapusBuku.addEventListener("click", () => {
        hapusUntukBuku(id);
      });
  
      pembungkus2.append(selesaiBuku, hapusBuku);
    } else {
      const bacaBuku = document.createElement("button");
      bacaBuku.innerHTML = `<i class="fa-solid fa-circle-arrow-up"></i>`;
      bacaBuku.classList.add("button-baca");
      bacaBuku.addEventListener("click", () => {
        membacaUntukBuku(id);
      });
  
      const hapusBuku = document.createElement("button");
      hapusBuku.innerHTML = `<i class="fa-solid fa-circle-minus"></i>`;
      hapusBuku.classList.add("button-hapus");
      hapusBuku.addEventListener("click", () => {
        hapusUntukBuku(id);
      });
  
      pembungkus2.append(bacaBuku, hapusBuku);
    }
  
    return cardBuku;
  };
  
  const tambahBuku = () => {
    const textJudul = document.getElementById("title").value;
    const textPenulis = document.getElementById("author").value;
    const textTahun = document.getElementById("year").value;
    const textStatus = document.getElementById("isCompleted").checked;
  
    const buatID = buatId();
    const bukuObjek = buatBukuObjek(buatID, textJudul, textPenulis, textTahun, textStatus);
    buku.push(bukuObjek);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
    document.getElementById("form").reset();
  };
  
  const membacaUntukBuku = (bukuId) => {
    const bukuTarget = cariBuku(bukuId);
    if (bukuTarget == null) return;
    Swal.fire({
      icon: "success",
      title: "Selamat",
      text: "Anda bisa membaca buku yang anda pilih",
    });
  
    bukuTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  };
  
  const hapusUntukBuku = (bukuId) => {
    Swal.fire({
      title: "Warning",
      text: "Apakah kamu yakin akan menghapus buku ini ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yakin",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        const bukuTarget = cariBukuIndex(bukuId);
        if (bukuTarget === -1) return;
        buku.splice(bukuTarget, 1);
        Swal.fire("Buku Terhapus!", "data buku anda sudah terhapus", "success");
      }
    });
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  };
  
  const kembaliUntukBuku = (bukuId) => {
    const bukuTarget = cariBuku(bukuId);
    if (bukuTarget == null) return;
  
    Swal.fire({
      icon: "success",
      title: "Terima Kasih",
      text: "Anda sudah membaca buku",
    });
  
    bukuTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const simpanBuku = document.getElementById("form");
    const formCariBuku = document.getElementById("formCariBuku");
    const formCariBuku2 = document.getElementById("formCariBuku");
  
    simpanBuku.addEventListener("submit", (event) => {
      event.preventDefault();
      tambahBuku();
    });
  
    formCariBuku.addEventListener("submit", (event) => {
      event.preventDefault();
      cariDataBuku();
    });
  
    formCariBuku2.addEventListener("keyup", (event) => {
      event.preventDefault();
      cariDataBuku();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  document.addEventListener(RENDER_EVENT, () => {
    const belumSelesai = document.getElementById("belumSelesai");
    const selesaiDibaca = document.getElementById("selesaiDibaca");
  
    belumSelesai.innerHTML = "";
    selesaiDibaca.innerHTML = "";
  
    for (bukuItem of buku) {
      const bukuElemen = buatBuku(bukuItem);
      if (bukuItem.isCompleted) {
        selesaiDibaca.append(bukuElemen);
      } else {
        belumSelesai.append(bukuElemen);
      }
    }
  });
  
  const simpanData = () => {
    if (isStorageExist()) {
      const simpan = JSON.stringify(buku);
      localStorage.setItem(KUNCI_DATA, simpan);
      document.dispatchEvent(new Event(SIMPAN_EVENT));
    }
  };
  
  const SIMPAN_EVENT = "simpan-buku";
  const KUNCI_DATA = "BUKU_APP";
  
  const isStorageExist = () => {
    if (typeof Storage === undefined) {
      alert("Browser tidak mendukung local storage");
      return false;
    }
    return true;
  };
  
  const loadDataFromStorage = () => {
    const serialData = localStorage.getItem(KUNCI_DATA);
    let data = JSON.parse(serialData);
  
    if (data !== null) {
      for (const bukuku of data) {
        buku.push(bukuku);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  };
  
  const cariDataBuku = () => {
    const cariBook = document.getElementById("cariBukuTitle").value.toLowerCase();
    const bukuCard = document.querySelectorAll(".card-buku");
    const bukuCari = document.querySelectorAll(".card-buku > .pembungkus > h3.namaBuku");
    for (let i = 0; i < bukuCari.length; i++) {
      judul = bukuCari[i].textContent || bukuCari[i].innerText;
      if (judul.toLowerCase().indexOf(cariBook) > -1) {
        const adaBuku = bukuCari[i];
        const adaBukd = bukuCard[i];
        adaBuku.style.display = "";
        adaBukd.style.display = "";
      } else {
        const adaBuku = bukuCari[i];
        const adaBukd = bukuCard[i];
        adaBuku.style.display = "none";
        adaBukd.style.display = "none";
      }
    }
  };
  