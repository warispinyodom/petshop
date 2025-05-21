import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [HttpClientModule, RouterLink ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private http:HttpClient, private router:Router) {}

  showuser: string | null = null
  showemail: string | null = null

  ngOnInit(): void {
    this.showuser = localStorage.getItem('user_username');
    this.showemail = localStorage.getItem('user_email');
  }

  async Logout() {
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_email');
    localStorage.removeItem('auth_token');

    await Swal.fire({
      title: "ออกจากระบบแล้ว",
      text: "คุณได้ทำการ ออกจากระบบ!",
      icon: "success"
    });
    this.router.navigate(['/login']);
  }

}
