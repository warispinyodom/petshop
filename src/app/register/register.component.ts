import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { response } from 'express';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private http: HttpClient, private router: Router) {}

  // ปิดรหัสผ่านไว้ เมื่อ true ถึงเปิดรหัสผ่าน
  showPassword: boolean = false;

  // เก็บ ค่า จาก form เพื่อนำมา จัดการฐานข้อมูล ใช้ reactive form control
  form = new FormGroup({
    username: new FormControl('', [Validators.required]), // เพิ่ม Validators module เข้าไปเพื่อตรวจสอบ
    email: new FormControl('', [Validators.required, Validators.email]), 
    password: new FormControl('', [Validators.required, Validators.minLength(8)]), // ความยาวรหัสผ่านน้อยสุด 6 ตัว
    tell: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]), // ตรวจสอบให้มี 0-9 ตัวเลขเบอร์โทร 10 หลัก
  });
  // ฟังชั่นแสดงรหัสผ่าน
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // อย่าลิมตรวจสอบการกรอกข้อมูลไม่ครบถ้วน
    if (this.form.invalid) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "ข้อมูลของท่านอาจจะไม่ถูกต้องหรือไม่ครบถ้วน!",
        icon: "warning" 
      })
      return;
    }

    // รับค่าสำเร็จ จะนำค่าไป insert เข้าฐานข้อมูลก็ต้อง ทำขั้นตอนปลอดภัยก่อน มี JWToken haspassword 
    this.checkData();

  }

  checkData() {

    const email = this.form.value.email; // เก็บค่าจาก input มาเป็น ตัวแปลเพื่อนำไป query request
    const username = this.form.value.username

    const params = new HttpParams() //ประกาศ param เพื่อ นำไป query params 
    .set('email', email ?? '') // set params email คือ input ที่รับจาก const email
    .set('username', username ?? '');

    this.http.get<{ exists: boolean }>('http://localhost:3000/checkUser', { params }) // หาก exists: boolean แบบว่ามีข้อมูลอยู่แล้ว ให้เป็น boolean
    .subscribe(response => { // แสดงผลออกมาว่า
      if (response.exists) {
        Swal.fire({
          title: "มีผู้ใช้งานนี้แล้ว",
          text: "กรุณาลองใหม่ อีกครั้ง!",
          icon: "warning"
        });
      } else {
        console.warn('กำลังทำการสมัคร')
        this.register();
      }
    });

  }

  register() {

    // จะทำการ register api ที่นี้ กำหนด formData เพื่อ เก็บ object ต่างๆใน form มา insert
    const formData = {
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      tell: this.form.value.tell
    }

    if (!this.form.valid) { // ตรวจสอบถ้าไม่มีฟอร์มให้หยุดทำการ insert 
      return;
    }

    this.http.post('http://localhost:3000/register', formData) // ทำการส่ง api post ไป insert ลงฐานข้อมูล
    .subscribe({
      next: (response) => {
        console.log('สมัครสมาชิกสำเร็จ', response); // ถ้าเกิดสำเร็จ
        this.form.reset(); // ให้รีเซ็ทค่า form
        Swal.fire({
          title: "สมัครสมาชิกสำเร็จ",
          text: "กรุณาทำการเข้าสู่ระบบ",
          icon: "success"
        })
        this.router.navigate(['/login']); // ไปหน้า login  ต่อ 
      },
      error: (err) => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่',
          icon: 'error'
        });
      }
    })

  }

}
