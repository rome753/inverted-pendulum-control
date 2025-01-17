class PID {
    constructor() {
        this.kp = 600;  // 比例系数
        this.ki = 1;  // 积分系数
        this.kd = 12000;   // 微分系数
        // 位置控制PID参数
        this.kp_pos = 10;
        this.ki_pos = 0.1;
        this.kd_pos = 550;


        this.lastError = 0;
        this.integral = 0;
        this.derivative = 0;

        this.lastError1 = 0;
        this.integral1 = 0;
        this.derivative1 = 0;

        // z轴角度PID状态
        this.lastErrorZ = 0;
        this.integralZ = 0;
        this.derivativeZ = 0;

        // x轴位置PID状态
        this.lastErrorX = 0;
        this.integralX = 0;
        this.derivativeX = 0;

        this.maxForce = 500;
    }

    control(angle, pos, vel, angularVel) {
        var fz = 0;
        if (Math.abs(angle.x) > Math.PI * 60 / 180) {
            if (Math.abs(angularVel.x) < 5 && Math.abs(angle.x) > Math.PI * 175 / 180) {
                fz = (angularVel.x > 0) ? -800 : 800;
            }

            // x轴角度PID状态
            this.lastError = 0;
            this.integral = 0;
            this.derivative = 0;

            // z轴位置PID状态
            this.lastError1 = 0;
            this.integral1 = 0;
            this.derivative1 = 0;
        } else {

            // 角度控制
            const angleError = angle.x;
            this.integral += angleError;
            this.derivative = angleError - this.lastError;
            this.lastError = angleError;

            const angleOutput = this.kp * angleError +
                this.ki * this.integral +
                this.kd * this.derivative;

            // 位置控制
            const pz = pos.z();
            const posError = pz;
            this.integral1 += posError;
            this.derivative1 = posError - this.lastError1;
            this.lastError1 = posError;

            var posOutput = this.kp_pos * posError +
                this.ki_pos * this.integral1 +
                this.kd_pos * this.derivative1;

            fz = angleOutput + posOutput;
        }

        var fx = 0;
        if (Math.abs(angle.z) > Math.PI * 60 / 180) {
             if (Math.abs(angularVel.z) < 5 && Math.abs(angle.z) > Math.PI * 175 / 180) {
                fx = (angularVel.z > 0) ? -800 : 800;
            }
            
            // z轴角度PID状态
            this.lastErrorZ = 0;
            this.integralZ = 0;
            this.derivativeZ = 0;

            // x轴位置PID状态
            this.lastErrorX = 0;
            this.integralX = 0;
            this.derivativeX = 0;
        } else {
            
            // Z轴角度控制
            const angleErrorZ = -angle.z;
            this.integralZ += angleErrorZ;
            this.derivativeZ = angleErrorZ - this.lastErrorZ;
            this.lastErrorZ = angleErrorZ;

            const angleOutputZ = this.kp * angleErrorZ +
                this.ki * this.integralZ +
                this.kd * this.derivativeZ;

            // X轴位置控制
            const px = pos.x();
            const posErrorX = px;
            this.integralX += posErrorX;
            this.derivativeX = posErrorX - this.lastErrorX;
            this.lastErrorX = posErrorX;

            var posOutputX = this.kp_pos * posErrorX +
                this.ki_pos * this.integralX +
                this.kd_pos * this.derivativeX;

            fx = angleOutputZ + posOutputX;

            if (fx > this.maxForce) {
                fx = this.maxForce;
            } else if (fx < -this.maxForce) {
                fx = -this.maxForce;
            }
        }



        if (fz > this.maxForce) {
            fz = this.maxForce;
        } else if (fz < -this.maxForce) {
            fz = -this.maxForce;
        }

        return {
            fx: fx,
            fz: fz
        }			
    }
}