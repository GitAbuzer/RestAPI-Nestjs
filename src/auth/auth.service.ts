import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AppUser)
    private readonly appUserRepository : Repository<AppUser>,
    private readonly jwtService : JwtService,
  ) {}
  async findUser(username: string) : Promise<AppUser | undefined> {
    const result : AppUser = await this.appUserRepository.findOneBy( { username } );
    return result;  
  }

  async signIn(signInDto: SignInDto) : Promise< { access_token: string } > {
    if(signInDto.username === '' || signInDto.password === '') 
      throw new UnauthorizedException();

    const sha256Password = createHash('sha256').update(signInDto.password).digest('base64');

    const user : AppUser = await this.findUser(signInDto.username);

    if(sha256Password !== user?.password)
      throw new UnauthorizedException();
      
    
    const roles : string[] = [] 
    
    user?.roles.forEach((r) => {
      roles.push(r.title.toString());
    });
    const payload = { 
      sub: user.id, 
      username: user.username,
      roles: roles
     };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findUser(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
