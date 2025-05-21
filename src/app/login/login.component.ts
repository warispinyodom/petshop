import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import e from 'express';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // หากเราจะเพิ่ม เราสามารถเพิ่มเข้าไปได้หลัง , พร้อมประกาศ private object OOP
  constructor(private http: HttpClient, private Router: Router) {}

  showPassword: boolean = false;

  // ฟังชั่นแสดงรหัสผ่าน
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // เก็บ form มาเพื่อทำการ เก็บค่าจาก input
  form = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  // สร้างฟังชั่นเมือ่กด onSubmit()
  onSubmit() {
    if(this.form.invalid) { // ถ้าฟอร์มเราไม่มีการกรอกข้อมูลอะไร จะเข้าเงื่อนไข กรอกข้อมูลไม่ครบ
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "ท่านไม่ได้กรอกข้อมูลให้ครบถ้วน กรุณาลองใหม่!",
        icon: "warning"
      });
      return;
    }else {
      // เข้ากระบวนการทำงา่น เข้าสู่ระบบ
      // เก็บ query params

      const email = this.form.value.email;
      const password = this.form.value.password;

      const params = new HttpParams() 
      .set('email', email ?? '') // ถ้าไม่มีค่าให้เป็น ค่าว่างแทน
      .set('password', password ?? '');

      this.http.get<any[]>('http://localhost:3000/login', {params})
      .subscribe({
        next: (res: any) => {
        if (res.user) {
            const emailsend = res.user.email;
            const usernamesend = res.user.username;

            localStorage.setItem('user_email', emailsend);
            localStorage.setItem('user_username', usernamesend);
            localStorage.setItem('auth_token', res.token);

            Swal.fire({
              title: "เข้าสู่ระบบสำเร็จ",
              text: "ยินดีต้อนรับ คุณลูกค้า",
              icon: "success"
            });

            this.Router.navigate(['/main']);
          } else {
              Swal.fire({
                title: "เข้าสู่ระบบไม่สำเร็จ",
                text: "กรุณาตรวจสอบอีเมล หรือรหัสผ่านของท่าน",
                icon: "error"
              });
          }
        },
        error: (err) => {
          console.log(err)
        }
      })

    }
  }

  // การ logout จากการ ลบ session

  // logout() {
  //   localStorage.removeItem('auth_token');
  //   localStorage.removeItem('user_email');
  //   localStorage.removeItem('user_username');
  //   localStorage.clear();
  // }

}
